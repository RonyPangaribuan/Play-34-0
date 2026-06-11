import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "34-0 Draft XI Indonesia",
  description: "Game fan draft XI sepakbola Indonesia. Spin klub dan musim, draft pemain, lalu simulasikan 34 laga.",
  openGraph: {
    title: "34-0 Draft XI Indonesia",
    description: "Draft XI sepak bola Indonesia, susun skuad, dan simulasikan musim 34 laga.",
    locale: "id_ID",
    siteName: "34-0 App",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
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
