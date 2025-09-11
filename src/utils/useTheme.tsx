import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

export function useTheme(overrideTheme?: ThemeMode): ThemeMode {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    if (overrideTheme) {
      setTheme(overrideTheme);
      return;
    }

    // Auto detect จาก html class
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // เฝ้าการเปลี่ยนแปลงของ class ที่ <html>
    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains('dark');
      setTheme(darkMode ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [overrideTheme]);

  return theme;
}
