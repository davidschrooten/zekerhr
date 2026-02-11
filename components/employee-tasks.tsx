import React from "react"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, FileText, Calendar } from 'lucide-react'

export function EmployeeTasks() {
  const tasks = [
    {
      id: 1,
      title: 'Verlofaanvraag voor 15-19 maart',
      description: 'Wachten op goedkeuring',
      icon: Clock,
      status: 'pending',
      action: 'Bekijken',
    },
    {
      id: 2,
      title: 'Jaarlijks functioneringsgesprek',
      description: 'Gepland voor 28 februari',
      icon: Calendar,
      status: 'upcoming',
      action: 'Details',
    },
    {
      id: 3,
      title: 'Contract verlenging',
      description: 'Teken je nieuwe contract',
      icon: FileText,
      status: 'action',
      action: 'Ondertekenen',
      highlight: true,
    },
    {
      id: 4,
      title: 'Verzuimmelding week 6',
      description: 'Bevestiging ontvangen',
      icon: CheckCircle2,
      status: 'complete',
      action: null,
    },
  ]

  return (
    <Card className="flex flex-col gap-4 border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Te doen
        </h2>
        <span className="text-sm text-muted-foreground">4 items</span>
      </div>

      <div className="flex flex-col">
        {tasks.map((task, index) => {
          const Icon = task.icon
          return (
            <div key={task.id}>
              <div
                className={`flex items-start justify-between gap-4 py-4 ${
                  task.highlight ? 'bg-amber-50 dark:bg-amber-950/20 -mx-6 px-6' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border ${
                      task.status === 'complete'
                        ? 'border-[rgb(16_185_129)] bg-[rgb(16_185_129)]/10'
                        : task.highlight
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-border bg-muted'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        task.status === 'complete'
                          ? 'text-[rgb(16_185_129)]'
                          : task.highlight
                            ? 'text-amber-600 dark:text-amber-500'
                            : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-foreground">
                      {task.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {task.description}
                    </div>
                  </div>
                </div>
                {task.action && (
                  <Button
                    variant={task.highlight ? 'default' : 'ghost'}
                    size="sm"
                    className="h-7 shrink-0 text-xs"
                  >
                    {task.action}
                  </Button>
                )}
              </div>
              {index < tasks.length - 1 && <div className="h-px bg-border" />}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
