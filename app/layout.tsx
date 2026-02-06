import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Dashboard - Organize Your Work",
  description: "Beautiful task dashboard with drag & drop - Built with Next.js and shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="dark">{children}</body>
    </html>
  );
}
