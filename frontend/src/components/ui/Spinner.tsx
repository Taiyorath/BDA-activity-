export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'
  return (
    <div
      className={`${s} border-2 border-[#EAE5DD] dark:border-[#383530] border-t-[#D97757] rounded-full animate-spin`}
    />
  )
}
