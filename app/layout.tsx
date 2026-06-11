import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['700'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'Ritual Fudder',
  description: 'Genesis Collection on Ritual Network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
