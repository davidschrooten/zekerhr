import { Card } from '@/components/ui/card'
import { FileText, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ActivityItem } from '@/app/actions/employee'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'

interface EmployeeActivityProps {
  activities: ActivityItem[];
}

export function EmployeeActivity({ activities }: EmployeeActivityProps) {
  
  const getIcon = (type: string, status?: string) => {
    if (type === 'leave') return Calendar;
    if (type === 'sickness') return status === 'recovered' ? CheckCircle2 : AlertTriangle;
    if (type === 'document') return FileText;
    return Clock;
  }

  const getColors = (type: string, status?: string) => {
    if (type === 'leave') {
       if (status === 'approved') return { bg: 'bg-emerald-100 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-500' };
       if (status === 'denied') return { bg: 'bg-red-100 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-500' };
       return { bg: 'bg-blue-100 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-500' };
    }
    if (type === 'sickness') {
      if (status === 'recovered') return { bg: 'bg-emerald-100 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-500' };
      return { bg: 'bg-amber-100 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-500' };
    }
    return { bg: 'bg-muted', text: 'text-muted-foreground' };
  }

  return (
    <Card className="flex flex-col gap-4 border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Recente activiteit
        </h2>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Bekijk alles
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {activities.length === 0 && (
          <div className="text-sm text-muted-foreground py-4 text-center">
            Geen recente activiteit.
          </div>
        )}
        {activities.map((activity) => {
          const Icon = getIcon(activity.type, activity.status)
          const colors = getColors(activity.type, activity.status)
          
          return (
            <div key={activity.id} className="flex gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border ${colors.bg}`}
              >
                <Icon className={`h-4 w-4 ${colors.text}`} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="text-sm font-medium text-foreground">
                  {activity.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.description}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: nl })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
