import { Clock, Calendar, AlertCircle, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function EmployeeMetrics() {
  const metrics = [
    {
      label: 'Verlof Saldo',
      value: '18.5 dagen',
      description: 'Beschikbaar verlof',
      icon: Calendar,
      trend: null,
    },
    {
      label: 'Verzuim',
      value: '0 dagen',
      description: 'Dit jaar',
      icon: AlertCircle,
      status: 'success',
    },
    {
      label: 'Uren deze maand',
      value: '152 uur',
      description: '4 uur vandaag',
      icon: Clock,
      trend: null,
    },
    {
      label: 'Documenten',
      value: '12',
      description: '2 nieuw',
      icon: FileText,
      trend: null,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card
            key={metric.label}
            className="flex flex-col gap-3 border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              {metric.status === 'success' && (
                <span className="text-xs font-medium text-[rgb(16_185_129)]">
                  ✓ Goed
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
              <div className="text-xs font-medium text-foreground">
                {metric.label}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
