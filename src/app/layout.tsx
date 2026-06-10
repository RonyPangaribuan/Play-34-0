import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "34-0 Draft XI Indonesia",
  description: "Draft XI Liga Indonesia, spin klub-musim, dan simulasi 34 laga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
