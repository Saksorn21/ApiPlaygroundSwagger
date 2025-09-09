import React , { useState } from 'react'
import { Menu, X, Sun, MoonStar , ChevronDown} from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ThemedBox } from '@/components/ThemedBox'
import ThemeToggle from '@/components/ThemeToggle'
interface LayoutProps {
  children: React.ReactNode
  title?: string
  theme: 'dark' | 'light'
  breadcrumbs?: Array<{ label: string; href?: string }>
  menusideber?: () => void
  isMenusideber?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, title, theme,breadcrumbs, menusideber, isMenusideber  }) =>{
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const navItems = [
    { href: '#', label: 'Home' },
    { href: '#', label: 'About'}
  ]
return (
  <ThemedBox>
  <div className="flex min-h-screen flex-col text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 transition-colors">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/30 dark:bg-slate-900/75">
      <div className="max-w-8xl mx-auto">
        <div className="flex h-16 items-center justify-between py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
          <div className="flex items-center ">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title || 'API Platform'}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-4 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white "
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-gray-700"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block size-6" aria-hidden="true" />
              ) : (
                <Menu className="block size-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
    
      <Breadcrumb items={breadcrumbs} onToggleSidebar={menusideber} isMenusideber={isMenusideber} />
    
        )}

        {/* Mobile Navigation Menu */}

      </div>
    </header>
    <div className={`fixed z-50 inset-0 lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>

      <div className="fixed top-4 right-4 w-full max-w-xs bg-white rounded-lg shadow-lg p-6 text-base font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:highlight-white/5">
        <button 
          onClick={closeMobileMenu}
          className='absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300'><X className="size=4"/></button>

        <ul className="space-y-6">        {navItems.map((item) => (
    <li key={item.href}>
          <a
            key={item.href}
            href={item.href}
            onClick={closeMobileMenu}
            className="hover:text-sky-500 dark:hover:text-sky-400"
          >
            {item.label}
          </a>
    </li>
        ))}
          <li>
            <a href="https://github.com/Saksorn21/ApiPlaygroundSwagger" className="hover:text-sky-500 dark:hover:text-sky-400">GitHub
            </a>
          </li>
        </ul>
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-200/10">
          <div className="flex items-center justify-between"><label  className="text-slate-700 font-normal dark:text-slate-400">Switch theme</label>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
    <main className="mx-auto max-w-7xl grow px-4 py-8 sm:px-6 lg:px-8">
{children}
    </main>
    <footer className="mt-auto border-t border-gray-200 bg-white shadow-inner dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} API Platform. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
  </ThemedBox>
)
}
export default Layout