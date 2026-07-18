import "./globals.css";

export const metadata = {
  title: "Controle de Mídia | Luiz & Kaly",
  description: "Controle de séries e filmes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
