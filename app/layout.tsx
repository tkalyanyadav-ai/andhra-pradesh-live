import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andhra Pradesh Live | Every Update. Every District.",
  description: "Andhra Pradesh government orders, administration, Amaravati development, district updates and verified state news.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}