import type { Metadata } from 'next';
import { AuthProvider } from '@/app/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Bookmarks',
  description: 'Save and organize your favorite bookmarks with real-time updates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
