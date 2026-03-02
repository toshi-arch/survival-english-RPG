import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Survival English Roleplay",
  description: "英語初心者向けインタラクティブ学習ゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
