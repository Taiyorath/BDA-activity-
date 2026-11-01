import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, MapPin, Clock, Cloud,
  AlertTriangle, Server, Database, Info, ChevronLeft, ChevronRight,
  Sparkles, X
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const NAV = [
  { to: '/overview',   label: 'Overview',          icon: LayoutDashboard },
  { to: '/analytics',  label: 'Accident Analytics', icon: BarChart2 },
  { to: '/blackspots', label: 'Black Spot Detection',icon: MapPin },
  { to: '/time',       label: 'Time Analysis',      icon: Clock },
  { to: '/weather',    label: 'Weather Analysis',   icon: Cloud },
  { to: '/severity',   label: 'Severity Analysis',  icon: AlertTriangle },
  { to: '/hadoop',     label: 'Hadoop Operations',  icon: Server },
  { to: '/data',       label: 'Data Management',    icon: Database },
  { to: '/about',      label: 'About Project',      icon: Info },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen, hadoopStatus } = useAppStore()
  const w = sidebarCollapsed ? '72px' : '250px'

  const handleLinkClick = () => {
    // Automatically close drawer on mobile when navigating
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 md:z-30 flex flex-col border-r border-[#EAE5DD] dark:border-[#383530] bg-[#F3EFEA] dark:bg-[#1D1C19] transition-all duration-300 overflow-hidden
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          w-[270px] ${sidebarCollapsed ? 'md:w-[72px]' : 'md:w-[250px]'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[#EAE5DD] dark:border-[#383530]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97757] flex items-center justify-center flex-shrink-0 shadow-sm text-white">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="overflow-hidden">
                <div className="font-serif text-lg font-medium tracking-tight text-[#262320] dark:text-[#EDE8E1] whitespace-nowrap">
                  AccidentIQ
                </div>
                <div className="text-[11px] font-medium tracking-wide uppercase text-[#8C8479] dark:text-[#8E877D] whitespace-nowrap">
                  Hadoop Big Data
                </div>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#6E685F] dark:text-[#9E978C] hover:bg-[#EAE4DC] dark:hover:bg-[#2C2A26] transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all group
                ${isActive
                  ? 'bg-[#EAE4DC] dark:bg-[#2C2A26] text-[#262320] dark:text-[#EDE8E1] shadow-xs'
                  : 'text-[#6E685F] dark:text-[#9E978C] hover:bg-[#ECE7DF] dark:hover:bg-[#262421] hover:text-[#262320] dark:hover:text-[#EDE8E1]'
                }`
              }
              title={sidebarCollapsed && !mobileMenuOpen ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-[#D97757]' : 'group-hover:text-[#D97757]'}`} />
                  {(!sidebarCollapsed || mobileMenuOpen) && (
                    <span className="whitespace-nowrap overflow-hidden">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[#EAE5DD] dark:border-[#383530] space-y-3">
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#EAE4DC]/60 dark:bg-[#262421]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4E8752] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4E8752]"></span>
                </span>
                <span className="text-[11px] font-medium text-[#6E685F] dark:text-[#9E978C]">
                  {hadoopStatus === 'connected' ? 'Cluster Online' : 'Hadoop Pipeline'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#FAF4EE] dark:bg-[#32302B] text-[#D97757] font-semibold">
                v3.3.6
              </span>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex w-full items-center justify-center p-2 rounded-xl text-[#6E685F] dark:text-[#9E978C] hover:bg-[#ECE7DF] dark:hover:bg-[#262421] hover:text-[#262320] dark:hover:text-[#EDE8E1] transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  )
}
