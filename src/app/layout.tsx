import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const robotoSans = Roboto({
  weight: ['400', '500'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SIGH',
  description: 'Sistema Integrado de Gerenciamento do Hóquei',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${robotoSans.className} antialiased`}>{children}</body>
    </html>
  );
}
