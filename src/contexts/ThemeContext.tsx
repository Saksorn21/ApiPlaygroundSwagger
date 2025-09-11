import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

interface ThemeContextValue {
  theme: ThemeMode; // ใช้สำหรับ className: theme === 'dark' ยังใช้ได้
  preference: ThemePreference; // user preference: light | dark | system
  setPreference: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemePreference;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
}) => {
  const [preference, setPreference] = useState<ThemePreference>(
    initialTheme || 'system',
  );
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      if (preference === 'system') {
        setTheme(matchMedia.matches ? 'dark' : 'light');
      } else {
        setTheme(preference);
      }
    };

    updateTheme();
    matchMedia.addEventListener('change', updateTheme);
    return () => matchMedia.removeEventListener('change', updateTheme);
  }, [preference]);

  // apply Tailwind dark class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

// hook สำหรับ className
export const useTheme = (): ThemeMode => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context.theme; // ให้ theme === 'dark' ยังคงใช้งานเดิม
};

// hook สำหรับปรับ system / preference
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error('useThemeContext must be used within ThemeProvider');
  return context; // theme, preference, setPreference
};
