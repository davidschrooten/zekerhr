import { Card } from '@/components/ui/card'
import { FileText, Calendar, Clock, CheckCircle2 } from 'lucide-react'

export function EmployeeActivity() {
  const activities = [
    {
      id: 1,
      title: 'Verlofaanvraag ingediend',
      description: '5 dagen verlof voor maart 2026',
      time: '2 uur geleden',
      icon: Calendar,
      iconBg: 'bg-blue-100 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      title: 'Werktijden bijgewerkt',
      description: '8 uur geregistreerd voor 11 februari',
      time: 'Vandaag om 17:30',
      icon: Clock,
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
    },
    {
      id: 3,
      title: 'Document ondertekend',
      description: 'Arbeidsvoorwaarden 2026',
      time: 'Gisteren om 14:22',
      icon: CheckCircle2,
      iconBg: 'bg-green-100 dark:bg-green-950',
      iconColor: 'text-[rgb(16_185_129)]',
    },
    {
      id: 4,
      title: 'Contract geüpload',
      description: 'Nieuw contract beschikbaar',
      time: '3 dagen geleden',
      icon: FileText,
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
    },
    {
      id: 5,
      title: 'Salaris uitbetaald',
      description: 'Januari 2026',
      time: '5 dagen geleden',
      icon: CheckCircle2,
      iconBg: 'bg-green-100 dark:bg-green-950',
      iconColor: 'text-[rgb(16_185_129)]',
    },
  ]

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
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border ${activity.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="text-sm font-medium text-foreground">
                  {activity.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.description}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
