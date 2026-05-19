import { cn } from "@/lib/utils";
import { MAX_URL, TELEGRAM_URL, WHATSAPP_URL } from "@/lib/contacts";

type SocialIconsProps = {
  className?: string;
  size?: "sm" | "md";
  variant?: "subtle" | "solid";
};

const SIZES = {
  sm: "h-9 w-9 text-[15px]",
  md: "h-10 w-10 text-base",
};

const VARIANTS = {
  subtle:
    "border border-white/70 bg-white/85 text-primary hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white",
  solid:
    "bg-primary text-white! shadow-[0_8px_18px_rgba(7,55,99,0.18)] hover:-translate-y-0.5 hover:bg-primary-hover",
};

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M21.7 3.4 2.6 10.9c-1 .4-1 1 .2 1.4l4.6 1.4 1.8 5.7c.2.7.4.9.9.9.4 0 .6-.2 1-.5l2-2 4.3 3.2c.8.4 1.4.2 1.6-.7l2.9-13.6c.3-1.3-.5-1.8-1.2-1.3Zm-3.9 4-7.7 7c-.3.3-.5.5-.6.8l-.3 2.7-1.2-4 9.8-6.1c.4-.3.8-.1.5.6Z" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19.1 4.9A9.85 9.85 0 0 0 12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10 0-2.7-1-5.2-2.9-6.9ZM12 20c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.4-1.3-3-1.3-4.6 0-4.5 3.7-8.3 8.3-8.3 2.2 0 4.3.9 5.9 2.4 1.6 1.6 2.4 3.7 2.4 5.9.1 4.7-3.6 8.5-8.2 8.5Zm4.5-6.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-1.4-.7-2.4-1.3-3.3-2.9-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1 2.7.1.2 1.8 2.8 4.5 3.9 1.7.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

function MaxIcon({ className }: { className?: string }) {
  // MAX messenger doesn't have a widely-known glyph yet; use a stylised "M"
  // inside a rounded square to read as an app icon.
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 18V8.2c0-.5.5-.8.9-.5L12 11l5.1-3.3c.4-.3.9 0 .9.5V18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

export function SocialIcons({
  className,
  size = "sm",
  variant = "subtle",
}: SocialIconsProps) {
  const itemClass = cn(
    "inline-flex items-center justify-center rounded-full transition",
    SIZES[size],
    VARIANTS[variant],
  );
  const iconClass = "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <a
        aria-label="Telegram"
        className={itemClass}
        href={TELEGRAM_URL}
        rel="noreferrer"
        target="_blank"
      >
        <TelegramIcon className={iconClass} />
      </a>
      <a
        aria-label="WhatsApp"
        className={itemClass}
        href={WHATSAPP_URL}
        rel="noreferrer"
        target="_blank"
      >
        <WhatsappIcon className={iconClass} />
      </a>
      <a
        aria-label="MAX"
        className={itemClass}
        href={MAX_URL}
        rel="noreferrer"
        target="_blank"
      >
        <MaxIcon className={iconClass} />
      </a>
    </div>
  );
}
