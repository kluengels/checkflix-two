"use client";
import {useTheme} from '@/context/ThemeProvider';
import {Moon, Sun} from 'lucide-react';

import {Button} from '@/components/ui/button';

/**
 * Theme switcher component to toggle between light and dark theme
 */
export function ThemeSwitcher() {
  const {setTheme, theme} = useTheme();

  return (
    <>
      {theme === 'light' && (
        <Button variant="ghost" className="text-black" aria-label="toogle theme" size="icon" onClick={() => setTheme('dark')}>
          <Moon />
        </Button>
      )}
      {theme === 'dark' && (
        <Button variant="ghost" aria-label="toogle theme" size="icon" onClick={() => setTheme('light')}>
          <Sun />
        </Button>
      )}
    </>
  );
}
