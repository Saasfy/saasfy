import './global.css';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@saasfy/components';
import { Toaster } from '@saasfy/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'Saasfy',
    template: `%s | Saasfy`,
  },
  description: 'Saasfy is a modern SaaS boilerplate.',
  applicationName: 'Saasfy',
  authors: {
    url: 'https://github.com/IKatsuba',
    name: 'Igor Katsuba',
  },
  creator: 'Igor Katsuba',
  keywords: ['saas', 'boilerplate', 'nextjs', 'typescript'],
  metadataBase: new URL('https://saasfy.dev'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
