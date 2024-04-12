import './global.css';
import { Toaster } from '@saasfy/ui/toaster';
import { ThemeProvider } from '@saasfy/components';

export const metadata = {
  title: {
    default: 'Saasfy',
    template: `%s | Saasfy`,
  },
  description: 'Saasfy is a modern SaaS boilerplate.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
