import React from 'react'
import { MoonStar, Sun, ChevronDown } from 'lucide-react'
import { useThemeContext } from '../contexts/ThemeContext' // <- เพิ่ม hook ใหม่

const ThemeToggle: React.FC = () => {
  const { theme, preference, setPreference } = useThemeContext(); // <- ใช้ context ไม่ใช่ local state

  
  const changeIcon = () => {
     if (theme === 'dark'){
       return <MoonStar className='size-4 mx-1'/>  
     } else if (theme === 'light') {
       return <Sun className='size-4 mx-1'/>
     }
    // อัปเดต <html class="..."> ด้วย เพื่อให้ tailwind dark mode ทำงาน
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  const capitalizeFirst = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return (

        <div className="relative flex items-center ring-1 ring-slate-900/10 rounded-lg shadow-sm p-2 text-slate-700 font-semibold dark:bg-slate-600 dark:ring-0 dark:highlight-white/5 dark:text-slate-200">
          {changeIcon()}
      {capitalizeFirst(preference)}<ChevronDown className="w-6 h-6 ml-2 text-slate-400" fill="none" />
          <select onChange={(e) => setPreference(e.target.value as 'light' | 'dark' | 'system')} className="absolute appearance-none inset-0 w-full h-full opacity-0" value={preference}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

  )
}

export default ThemeToggle;