import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  image: string;
  priceLabel: string;
  unitPrice: number | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalKnown: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "med-x-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is CartItem => {
        if (!item || typeof item !== "object") return false;
        const candidate = item as Partial<CartItem>;
        return (
          typeof candidate.productId === "string" &&
          typeof candidate.title === "string" &&
          typeof candidate.quantity === "number" &&
          candidate.quantity > 0
        );
      })
      .map((item) => ({
        ...item,
        image: typeof item.image === "string" ? item.image : "",
        priceLabel: typeof item.priceLabel === "string" ? item.priceLabel : "",
        slug: typeof item.slug === "string" ? item.slug : "",
        unitPrice:
          typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice)
            ? item.unitPrice
            : null,
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be full or blocked — ignore, cart will just be ephemeral.
    }
  }, [items]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const add = useCallback<CartContextValue["add"]>((item, quantity = 1) => {
    if (quantity <= 0) return;
    setItems((current) => {
      const index = current.findIndex((row) => row.productId === item.productId);
      if (index === -1) {
        return [...current, { ...item, quantity }];
      }
      const next = current.slice();
      next[index] = { ...next[index], quantity: next[index].quantity + quantity };
      return next;
    });
  }, []);

  const setQuantity = useCallback<CartContextValue["setQuantity"]>(
    (productId, quantity) => {
      setItems((current) => {
        if (quantity <= 0) return current.filter((row) => row.productId !== productId);
        return current.map((row) =>
          row.productId === productId ? { ...row, quantity } : row,
        );
      });
    },
    [],
  );

  const remove = useCallback<CartContextValue["remove"]>((productId) => {
    setItems((current) => current.filter((row) => row.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, row) => sum + row.quantity, 0);
    const totalKnown = items.reduce(
      (sum, row) => sum + (row.unitPrice != null ? row.unitPrice * row.quantity : 0),
      0,
    );
    return {
      items,
      count,
      totalKnown,
      add,
      setQuantity,
      remove,
      clear,
      isOpen,
      open,
      close,
    };
  }, [items, add, setQuantity, remove, clear, isOpen, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
