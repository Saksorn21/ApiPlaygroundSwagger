import React from 'react'
import { ChevronRight, Home, Menu } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onToggleSidebar?: () => void
  isMenusideber?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onToggleSidebar, isMenusideber }) => {
  return (
    <nav className="flex items-center p-4 border-b border-slate-900/10 lg:hidden dark:border-slate-50/[0.06]">
      {/* ปุ่มสำหรับเปิด DocsSidebar - แสดงเฉพาะบนหน้าจอขนาดเล็ก */}
      {isMenusideber && onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="mr-2 rounded-lg p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-4" />
        </button>
      )}
      <a
        href="/"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
      >
        <Home className="size-4" />
        <span className="sr-only">Home</span>
      </a>
      {items.map((crumb, index) => (
        <React.Fragment key={crumb.label}>
          <ChevronRight className="mx-1 size-5 text-gray-400 dark:text-gray-500" />
          {crumb.href ? (
            <a
              href={crumb.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {crumb.label}
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
