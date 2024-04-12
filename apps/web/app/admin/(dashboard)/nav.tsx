'use client';

import Link from 'next/link';
import { PackageIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardNav() {
  const path = usePathname();

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      <Link
        className={
          path === '/plans'
            ? 'flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50'
            : 'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
        }
        href="#"
      >
        <PackageIcon className="h-4 w-4" />
        Plans
      </Link>
    </nav>
  );
}
