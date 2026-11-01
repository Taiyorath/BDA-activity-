import { ReactNode } from 'react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  iconBg?: string
  loading?: boolean
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-[#FAF4EE] dark:bg-[#332A24] text-[#D97757]',
  loading
}: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4 sm:p-6 animate-pulse">
        <div className="h-3 bg-[#EAE5DD] dark:bg-[#383530] rounded w-24 mb-4" />
        <div className="h-8 sm:h-9 bg-[#EAE5DD] dark:bg-[#383530] rounded w-32 mb-2" />
        <div className="h-3 bg-[#EAE5DD] dark:bg-[#383530] rounded w-20" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4 sm:p-6 shadow-[0_2px_10px_-4px_rgba(38,35,32,0.05)] dark:shadow-none hover:border-[#D97757]/40 dark:hover:border-[#D97757]/40 transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#8C8479] dark:text-[#9A9387] uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight truncate">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2.5 sm:p-3 rounded-xl ${iconBg} flex-shrink-0 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
