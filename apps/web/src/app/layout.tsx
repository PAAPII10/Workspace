import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arvasit Web App',
  description: 'Next.js web frontend application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
