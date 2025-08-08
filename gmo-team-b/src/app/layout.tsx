import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import { AuthProvider } from '../contexts/AuthContext';
import { PageTransition } from '../components/PageTransition';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConoHa control panel",
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeRegistry>
        <body className={inter.className}>
          <AuthProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </AuthProvider>
        </body>
      </ThemeRegistry>
    </html>
  );
}

