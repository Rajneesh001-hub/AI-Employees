import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Business OS | Style Street',
  description: 'One platform. Multiple AI employees. Smarter business operations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
