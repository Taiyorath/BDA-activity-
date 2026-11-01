type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'amber' | 'brand'

const CLASSES: Record<Variant, string> = {
  default:  'bg-[#F1EDE6] dark:bg-[#322F2A] text-[#524C44] dark:text-[#C5BEB3] border border-[#E4DEC3]/40 dark:border-transparent',
  brand:    'bg-[#FAF4EE] dark:bg-[#362720] text-[#D97757] dark:text-[#E89578] border border-[#E8C8B3]/50 dark:border-[#5F2B1B]',
  success:  'bg-[#EDF5EE] dark:bg-[#202E22] text-[#3B723F] dark:text-[#78B97E] border border-[#CCE3CD]/50 dark:border-transparent',
  warning:  'bg-[#FAF3E6] dark:bg-[#332A1C] text-[#8C5D20] dark:text-[#E0A756] border border-[#EEDDBF]/50 dark:border-transparent',
  danger:   'bg-[#FDF0ED] dark:bg-[#35211D] text-[#A8402E] dark:text-[#E47B6A] border border-[#F5C7BE]/50 dark:border-transparent',
  info:     'bg-[#EFF4F8] dark:bg-[#202933] text-[#3B668C] dark:text-[#7DA4C7] border border-[#CEE0EF]/50 dark:border-transparent',
  purple:   'bg-[#F6EFF6] dark:bg-[#302130] text-[#764372] dark:text-[#C38EBE] border border-[#E5CCE4]/50 dark:border-transparent',
  amber:    'bg-[#FAF4EE] dark:bg-[#362720] text-[#D97757] dark:text-[#E89578] border border-[#E8C8B3]/50 dark:border-[#5F2B1B]',
}

export default function Badge({
  children,
  variant = 'default',
  className = ''
}: {
  children: React.ReactNode
  variant?: Variant
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-tight transition-colors ${CLASSES[variant]} ${className}`}>
      {children}
    </span>
  )
}
