import { useQuery } from '@tanstack/react-query'
import { accidentService } from '../services/api'
import PieChartWrapper from '../components/charts/PieChartWrapper'
import BarChartWrapper from '../components/charts/BarChartWrapper'
import Card from '../components/ui/Card'
import { CloudRain, Info } from 'lucide-react'

export default function WeatherAnalysis() {
  const weather  = useQuery({ queryKey: ['weather-wc'], queryFn: () => accidentService.getByWeather('weather_condition') })
  const road     = useQuery({ queryKey: ['weather-rc'], queryFn: () => accidentService.getByWeather('road_condition') })

  const weatherData = (weather.data ?? []).slice(0, 12)
  const roadData    = (road.data ?? []).slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#D97757] dark:text-[#E89578] mb-1">
          Environmental Risk Covariates
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
          Weather & Environmental Conditions
        </h2>
        <p className="text-sm text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-2xl leading-relaxed">
          Evaluating the interplay of precipitation, visibility, and road surface hazards on vehicular collision rates.
        </p>
      </div>

      {/* Claude Editorial Advisory Card */}
      <Card className="bg-[#FAF8F5] dark:bg-[#1D1C19] border-[#E8C8B3]/60 dark:border-[#5F2B1B]/60">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-[#FAF4EE] dark:bg-[#362720] text-[#D97757] flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-medium text-[#262320] dark:text-[#EDE8E1]">
              Statistical Correlation Advisory
            </h4>
            <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-1 leading-relaxed">
              Charts present observational correlation between meteorological classifications and collision frequency.
              Precipitation and icing amplify road friction hazards, though baseline traffic exposure remains the primary causal determinant.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartWrapper
          data={weatherData.slice(0, 8)}
          nameKey="weather_condition"
          valueKey="count"
          title="Meteorological Category Distribution"
          subtitle="Proportional frequency across distinct weather states"
          loading={weather.isLoading}
        />
        <BarChartWrapper
          data={weatherData}
          xKey="weather_condition" yKey="count"
          title="Weather Condition Frequency (Top 12)"
          subtitle="Total volume of recorded incidents per atmospheric condition"
          loading={weather.isLoading}
          horizontal height={340}
        />
      </div>

      <BarChartWrapper
        data={roadData}
        xKey="road_condition" yKey="count"
        title="Road Surface Condition Impact"
        subtitle="Accident counts classified by road surface moisture and traction state"
        loading={road.isLoading}
        colors={['#D48B38']}
        height={270}
      />
    </div>
  )
}
