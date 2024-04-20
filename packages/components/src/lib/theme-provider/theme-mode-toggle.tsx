'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Check, Moon, Sun } from 'lucide-react';

import { Button } from '@saasfy/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@saasfy/ui/dropdown-menu';
import { cn } from '@saasfy/utils';

export function ThemeModeToggle() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem onClick={() => setTheme(t)} key={t} className="capitalize">
            <Check className={cn('mr-2 h-4 w-4', theme === t ? 'opacity-100' : 'opacity-0')} />
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
