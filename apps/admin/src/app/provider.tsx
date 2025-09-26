'use client';

import { ThemeProvider } from '@arvasit/components';

export default function Provider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>;
}
