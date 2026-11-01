import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'

// Claude's Editorial Warm Palette
export const CLAUDE_COLORS = [
  '#D97757', // Terracotta Coral
  '#5C8A74', // Sage Forest
  '#D48B38', // Ochre Amber
  '#8B5E83', // Dusty Plum
  '#5E7A94', // Muted Slate
  '#C95742', // Deep Clay
  '#A37F5D', // Warm Sienna
  '#488F96', // River Teal
  '#7B906F', // Olive Sage
  '#B36B51', // Rust
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#252421] border border-[#EAE5DD] dark:border-[#383530] rounded-xl px-3.5 py-2.5 shadow-lg text-xs">
      <p className="font-serif font-medium text-[#262320] dark:text-[#EDE8E1] mb-1.5 border-b border-[#F0ECE4] dark:border-[#2F2D28] pb-1">
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-[#6E685F] dark:text-[#9A9387]">{p.name}:</span>
          <span className="font-medium text-[#262320] dark:text-[#EDE8E1]">{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

interface BarChartProps {
  data: any[]
  xKey: string
  yKey: string | string[]
  title?: string
  subtitle?: string
  horizontal?: boolean
  colors?: string[]
  loading?: boolean
  height?: number
}

export default function BarChartWrapper({
  data, xKey, yKey, title, subtitle, horizontal, colors = CLAUDE_COLORS, loading, height = 300
}: BarChartProps) {
  if (loading) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="animate-pulse h-[300px] bg-[#F5F1EB] dark:bg-[#2A2925] rounded-xl" />
      </Card>
    )
  }

  const keys = Array.isArray(yKey) ? yKey : [yKey]

  return (
    <Card title={title} subtitle={subtitle}>
      {!data?.length ? (
        <EmptyState title="No data available" description="Data will appear once ingestion completes" />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout={horizontal ? 'vertical' : 'horizontal'}
            margin={{ top: 8, right: 16, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#EAE5DD] dark:text-[#33312C]" opacity={0.6} />
            {horizontal ? (
              <>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#8C8479' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey={xKey} tick={{ fontSize: 10, fill: '#8C8479' }} tickLine={false} axisLine={false} width={85} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: '#8C8479' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#8C8479' }} tickLine={false} axisLine={false} />
              </>
            )}
            <Tooltip content={<CustomTooltip />} />
            {keys.length > 1 && (
              <Legend
                formatter={(val) => <span className="text-xs text-[#6E685F] dark:text-[#9A9387]">{val}</span>}
              />
            )}
            {keys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4,4,0,0]} maxBarSize={45}>
                {keys.length === 1 && data.map((_: any, idx: number) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
