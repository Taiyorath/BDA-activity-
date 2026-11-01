import { useLocation } from 'react-router-dom'
import { Sun, Moon, GitBranch, Sparkles, Menu } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const PAGE_TITLES: Record<string, string> = {
  '/overview':   'Executive Overview',
  '/analytics':  'Accident Pattern Analytics',
  '/blackspots': 'Black Spot & Hotspot Identification',
  '/time':       'Temporal & Hourly Dynamics',
  '/weather':    'Weather & Environmental Conditions',
  '/severity':   'Accident Severity Classification',
  '/hadoop':     'Hadoop Ecosystem Console',
  '/data':       'Data Ingestion & Preprocessing',
  '/about':      'Academic Case Study & Architecture',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const { theme, toggleTheme, toggleMobileMenu } = useAppStore()
  const title = PAGE_TITLES[pathname] ?? 'Analytics Dashboard'

  return (
    <header className="h-16 flex items-center justify-between px-3.5 sm:px-6 md:px-8 border-b border-[#EAE5DD] dark:border-[#383530] bg-[#FBF9F5]/90 dark:bg-[#181715]/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#6E685F] dark:text-[#9E978C] hover:bg-[#F3EFEA] dark:hover:bg-[#252421] hover:text-[#262320] dark:hover:text-[#EDE8E1] transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-serif text-base sm:text-xl md:text-2xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Claude Warm Pill Tag (Hidden on small mobile) */}
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-[#E8C8B3] bg-[#FAF4EE] dark:bg-[#2A231F] dark:border-[#5F2B1B] text-[#D97757] dark:text-[#E89578] shadow-2xs whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 fill-[#D97757]/20" />
          50,000 Sample Records
        </span>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#6E685F] dark:text-[#9E978C] hover:bg-[#F3EFEA] dark:hover:bg-[#252421] hover:text-[#262320] dark:hover:text-[#EDE8E1] border border-transparent hover:border-[#EAE5DD] dark:hover:border-[#383530] transition-all cursor-pointer"
          title={theme === 'dark' ? 'Switch to Warm Light theme' : 'Switch to Espresso Dark theme'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#D97757]" />
          ) : (
            <Moon className="w-4 h-4 text-[#6E685F]" />
          )}
        </button>

        {/* GitHub link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-[#6E685F] dark:text-[#9E978C] hover:bg-[#F3EFEA] dark:hover:bg-[#252421] hover:text-[#262320] dark:hover:text-[#EDE8E1] border border-transparent hover:border-[#EAE5DD] dark:hover:border-[#383530] transition-all"
          title="Source Code"
        >
          <GitBranch className="w-4 h-4" />
        </a>
      </div>
    </header>
  )
}
