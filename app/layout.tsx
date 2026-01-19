import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel Pro - Smart Expiry System",
  description: "Advanced notification and expiry tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
