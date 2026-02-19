"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FileText, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ActivityItem } from '@/app/actions/employee'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'
import { motion } from "framer-motion"

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
       if (status === 'approved') return { bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-600' };
       if (status === 'denied') return { bg: 'bg-red-50 text-red-600', text: 'text-red-600' };
       return { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-600' };
    }
    if (type === 'sickness') {
      if (status === 'recovered') return { bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-600' };
      return { bg: 'bg-amber-50 text-amber-600', text: 'text-amber-600' };
    }
    return { bg: 'bg-muted text-muted-foreground', text: 'text-muted-foreground' };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full border-border/50 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">
              Recente activiteit
            </CardTitle>
            <button
              type="button"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Bekijk alles
            </button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-0">
          <div className="flex flex-col">
            {activities.length === 0 && (
              <div className="text-sm text-muted-foreground py-8 text-center">
                Geen recente activiteit.
              </div>
            )}
            {activities.map((activity, index) => {
              const Icon = getIcon(activity.type, activity.status)
              const colors = getColors(activity.type, activity.status)
              
              return (
                <div key={activity.id} className={`flex gap-4 p-4 hover:bg-muted/30 transition-colors ${index !== activities.length - 1 ? 'border-b border-border/40' : ''}`}>
                  <div
                    className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}
                  >
                    <Icon className={`h-4 w-4`} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="text-sm font-medium text-foreground">
                      {activity.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.description}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: nl })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
