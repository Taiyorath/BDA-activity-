import { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F3EFEA] dark:bg-[#2A2925] border border-[#EAE5DD] dark:border-[#383530] flex items-center justify-center mb-4 text-[#8C8479]">
        {icon ?? <Inbox className="w-5 h-5" />}
      </div>
      <h3 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-[#7A746B] dark:text-[#9A9387] max-w-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
