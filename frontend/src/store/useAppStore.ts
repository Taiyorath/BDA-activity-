import { create } from 'zustand'

type Theme = 'light' | 'dark'
type HadoopStatus = 'connected' | 'disconnected' | 'checking'

interface AppStore {
  theme: Theme
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  hadoopStatus: HadoopStatus
  toggleTheme: () => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setHadoopStatus: (status: HadoopStatus) => void
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export const useAppStore = create<AppStore>((set) => {
  const initialTheme = getInitialTheme()
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return {
    theme: initialTheme,
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    hadoopStatus: 'checking',

    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { theme: newTheme }
      }),

    toggleSidebar: () =>
      set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    setMobileMenuOpen: (open: boolean) =>
      set({ mobileMenuOpen: open }),

    toggleMobileMenu: () =>
      set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

    setHadoopStatus: (status: HadoopStatus) =>
      set({ hadoopStatus: status }),
  }
})
