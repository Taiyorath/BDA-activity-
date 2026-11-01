import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAppStore } from '../../store/useAppStore'

export default function AppShell() {
  const collapsed = useAppStore(s => s.sidebarCollapsed)

  return (
    <div className="flex h-screen bg-[#FBF9F5] dark:bg-[#181715] text-[#262320] dark:text-[#EDE8E1] overflow-hidden selection:bg-[#E8C8B3] dark:selection:bg-[#5F2B1B]">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 w-full ml-0 ${
          collapsed ? 'md:ml-[72px]' : 'md:ml-[250px]'
        }`}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 md:px-8 md:py-7">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
