import React from 'react';
import { MoonStar, Sun, ChevronDown } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext'; // <- เพิ่ม hook ใหม่

const ThemeToggle: React.FC = () => {
  const { theme, preference, setPreference } = useThemeContext(); // <- ใช้ context ไม่ใช่ local state

  const changeIcon = () => {
    if (theme === 'dark') {
      return <MoonStar className="mx-1 size-4" />;
    } else if (theme === 'light') {
      return <Sun className="mx-1 size-4" />;
    }
    // อัปเดต <html class="..."> ด้วย เพื่อให้ tailwind dark mode ทำงาน
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  const capitalizeFirst = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  return (
    <div className="dark:highlight-white/5 relative flex items-center rounded-lg p-2 font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/10 dark:bg-slate-600 dark:text-slate-200 dark:ring-0">
      {changeIcon()}
      {capitalizeFirst(preference)}
      <ChevronDown className="ml-2 h-6 w-6 text-slate-400" fill="none" />
      <select
        onChange={(e) =>
          setPreference(e.target.value as 'light' | 'dark' | 'system')
        }
        className="absolute inset-0 h-full w-full appearance-none opacity-0"
        value={preference}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export default ThemeToggle;
