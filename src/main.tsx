import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LeadModalProvider } from "@/contexts/LeadModalContext";
import { App } from "@/App";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <CartProvider>
          <LeadModalProvider>
            <App />
          </LeadModalProvider>
        </CartProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
