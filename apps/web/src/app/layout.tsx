import type { Metadata } from "next";
import { ThemeScript } from "../components/theme/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waypoint",
  description: "Memória profissional organizada para carreira, estudos e conquistas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="light" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
