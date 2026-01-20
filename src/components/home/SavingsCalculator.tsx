'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  city: string
  months: number
  savings: {
    airbnb: number
    inhabitme: number
    savings: number
  }
  onCityChange: (city: string) => void
  onMonthsChange: (months: number) => void
}

export function SavingsCalculator({
  city,
  months,
  savings,
  onCityChange,
  onMonthsChange
}: Props) {
  return (
    <Card className="relative border-2">
      <CardHeader>
        <CardTitle>Calcula tu ahorro</CardTitle>
        <p className="text-sm text-gray-600">vs. plataformas tradicionales</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Ciudad</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          >
            <option value="madrid">Madrid</option>
            <option value="barcelona">Barcelona</option>
            <option value="lisboa">Lisboa</option>
            <option value="porto">Porto</option>
            <option value="valencia">Valencia</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Duración: {months} {months === 1 ? 'mes' : 'meses'}
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={months}
            onChange={(e) => onMonthsChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Airbnb tradicional</span>
            <span className="font-semibold text-gray-400 line-through">
              €{savings.airbnb.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">inhabitme</span>
            <span className="font-bold text-blue-600">
              €{savings.inhabitme.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-green-100 bg-green-50 -mx-6 px-6 py-3 rounded-lg">
            <span className="font-bold text-green-800">Te ahorras</span>
            <span className="font-bold text-2xl text-green-600">
              €{savings.savings.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
