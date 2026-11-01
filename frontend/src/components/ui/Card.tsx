import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: ReactNode
  noPad?: boolean
}

export default function Card({ children, className = '', title, subtitle, action, noPad }: CardProps) {
  return (
    <div className={`bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] shadow-[0_2px_10px_-4px_rgba(38,35,32,0.05)] dark:shadow-none transition-all ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-[#F0ECE4] dark:border-[#2F2D28]">
          <div>
            {title && (
              <h3 className="font-serif text-sm sm:text-base font-medium text-[#262320] dark:text-[#EDE8E1] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-[#7A746B] dark:text-[#9A9387] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPad ? '' : 'p-4 sm:p-6'}>{children}</div>
    </div>
  )
}
