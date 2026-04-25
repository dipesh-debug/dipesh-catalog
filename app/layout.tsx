import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Dipesh Catalog",
  description: "B2B Wholesale Apparel Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#111111] text-white antialiased">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pb-16">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}