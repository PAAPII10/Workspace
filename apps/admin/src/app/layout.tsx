import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arvasit Admin Dashboard',
  description: 'Next.js admin dashboard application',
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
