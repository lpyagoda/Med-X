import type { Metadata } from "next";
import { Wix_Madefor_Display, Wix_Madefor_Text } from "next/font/google";
import { LeadModal } from "@/components/forms/LeadModal";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LeadModalProvider } from "@/contexts/LeadModalContext";
import "./globals.css";

const wixDisplay = Wix_Madefor_Display({
  display: "swap",
  subsets: ["cyrillic", "latin"],
  variable: "--font-wix-display",
});

const wixText = Wix_Madefor_Text({
  display: "swap",
  subsets: ["cyrillic", "latin"],
  variable: "--font-wix-text",
});

export const metadata: Metadata = {
  title: "MED-IX | Стоматологическое оборудование",
  description:
    "Premium B2B-каталог стоматологического оборудования, запасных частей и расходных материалов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${wixDisplay.variable} ${wixText.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <LeadModalProvider>
          <Header />
          <main className="flex-1 pt-0">{children}</main>
          <Footer />
          <LeadModal />
        </LeadModalProvider>
      </body>
    </html>
  );
}
