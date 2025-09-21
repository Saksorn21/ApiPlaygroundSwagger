import React from 'react';
import { MoonStar, Sun, ChevronDown } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext'; // <- เพิ่ม hook ใหม่
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className=' text-shadow-sm'>
          {changeIcon()}
          {capitalizeFirst(preference)}
        </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-slate-700 " >
        <DropdownMenuLabel>Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={preference} onValueChange={
            setPreference}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    
  );
};

export default ThemeToggle;
