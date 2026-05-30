import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MailFlow - Adaptive Email Client",
  description: "An adaptive email client built with OUAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
