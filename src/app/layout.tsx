import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "TenderMarket - Marketplace B2B para Tenderos y Proveedores",
  description:
    "Conectamos tenderos con proveedores mayoristas. Simplifica tus compras al por mayor con los mejores precios y entregas rápidas.",
  icons: {
    icon: [
      {
        url: "/Logo.svg",
        type: "image/png",
      },
    ],
    apple: "/Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-background min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
