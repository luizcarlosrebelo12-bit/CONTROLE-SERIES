import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Controle de Mídia | Luiz & Kaly",
  description: "Controle de séries e filmes",
};

export const viewport = {
  themeColor: "#0b0e14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} bg-base-bg`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
