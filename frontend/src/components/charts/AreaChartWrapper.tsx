import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#252421] border border-[#EAE5DD] dark:border-[#383530] rounded-xl px-3.5 py-2.5 shadow-lg text-xs">
      <p className="font-serif font-medium text-[#262320] dark:text-[#EDE8E1] mb-1.5 border-b border-[#F0ECE4] dark:border-[#2F2D28] pb-1">
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-[#6E685F] dark:text-[#9A9387]">Accidents:</span>
          <span className="font-medium text-[#262320] dark:text-[#EDE8E1]">{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

interface AreaChartProps {
  data: any[]
  xKey: string
  yKey: string
  title?: string
  subtitle?: string
  color?: string
  loading?: boolean
  height?: number
}

export default function AreaChartWrapper({
  data, xKey, yKey, title, subtitle, color = '#D97757', loading, height = 300
}: AreaChartProps) {
  if (loading) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="animate-pulse h-[300px] bg-[#F5F1EB] dark:bg-[#2A2925] rounded-xl" />
      </Card>
    )
  }

  const gradId = `claude-area-${yKey}`

  return (
    <Card title={title} subtitle={subtitle}>
      {!data?.length ? (
        <EmptyState title="No data available" description="Data will appear once ingestion completes" />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#EAE5DD] dark:text-[#33312C]" opacity={0.6} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#8C8479' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#8C8479' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 5, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
