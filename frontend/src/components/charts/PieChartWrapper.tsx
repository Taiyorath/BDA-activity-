import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import { CLAUDE_COLORS } from './BarChartWrapper'

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="bg-white dark:bg-[#252421] border border-[#EAE5DD] dark:border-[#383530] rounded-xl px-3.5 py-2.5 shadow-lg text-xs">
      <p className="font-serif font-medium text-[#262320] dark:text-[#EDE8E1] mb-1">
        {p.name}
      </p>
      <p className="text-[#6E685F] dark:text-[#9A9387]">
        {Number(p.value).toLocaleString()} {p.payload.percent ? `(${(p.payload.percent * 100).toFixed(1)}%)` : ''}
      </p>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, outerRadius, percent }: any) => {
  if (percent < 0.05) return null
  const r = outerRadius + 18
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#8C8479" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

interface PieChartProps {
  data: any[]
  nameKey: string
  valueKey: string
  title?: string
  subtitle?: string
  colors?: string[]
  loading?: boolean
  height?: number
}

export default function PieChartWrapper({
  data, nameKey, valueKey, title, subtitle, colors = CLAUDE_COLORS, loading, height = 300
}: PieChartProps) {
  if (loading) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="animate-pulse h-[300px] bg-[#F5F1EB] dark:bg-[#2A2925] rounded-xl" />
      </Card>
    )
  }

  const total = data.reduce((s, d) => s + (d[valueKey] || 0), 0)
  const withPercent = data.map(d => ({ ...d, percent: total > 0 ? d[valueKey] / total : 0 }))

  return (
    <Card title={title} subtitle={subtitle}>
      {!data?.length ? (
        <EmptyState title="No data available" description="Data will appear once ingestion completes" />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={withPercent}
              dataKey={valueKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={85}
              paddingAngle={3}
              label={renderLabel}
              labelLine={false}
            >
              {withPercent.map((_: any, i: number) => (
                <Cell key={i} fill={colors[i % colors.length]} stroke="currentColor" className="text-white dark:text-[#252421]" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(val) => <span className="text-xs text-[#6E685F] dark:text-[#9A9387]">{val}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
