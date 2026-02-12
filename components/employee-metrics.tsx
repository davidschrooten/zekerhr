import { Clock, Calendar, AlertCircle, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { EmployeeMetricsData } from '@/app/actions/employee'

interface EmployeeMetricsProps {
  metrics: EmployeeMetricsData;
}

export function EmployeeMetrics({ metrics }: EmployeeMetricsProps) {
  const data = [
    {
      label: 'Verlof Saldo',
      value: `${metrics.leaveBalance.total} ${metrics.leaveBalance.unit === 'days' ? 'dagen' : 'uur'}`,
      description: 'Beschikbaar verlof',
      icon: Calendar,
      trend: null,
    },
    {
      label: 'Verzuim',
      value: metrics.activeSickness ? 'Ziek gemeld' : 'Niet ziek',
      description: metrics.activeSickness ? 'Beterschap!' : 'Alles goed',
      icon: AlertCircle,
      status: metrics.activeSickness ? 'warning' : 'success',
    },
    {
      label: 'Contract Uren',
      value: `${metrics.contractHours} uur`,
      description: 'Per week',
      icon: Clock,
      trend: null,
    },
    {
      label: 'Documenten',
      value: `${metrics.documentsCount}`,
      description: 'Totaal beschikbaar',
      icon: FileText,
      trend: null,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((metric) => {
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
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                  ✓ Goed
                </span>
              )}
              {metric.status === 'warning' && (
                <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
                  ⚠ Let op
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
