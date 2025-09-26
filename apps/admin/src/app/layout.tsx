import type { Metadata } from 'next';

import './globals.css';
import Provider from './provider';

export const metadata: Metadata = {
  title: 'Arvasit Admin Dashboard',
  description: 'Next.js admin dashboard application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
