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
      <Card className="flex flex-col h-full border-none bg-white shadow-organic rounded-organic overflow-hidden">
        <CardHeader className="border-b-0 px-8 py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-espresso tracking-tight">
              Recente activiteit
            </CardTitle>
            <button
              type="button"
              className="text-sm font-medium text-cedar hover:text-espresso transition-colors"
            >
              Bekijk alles
            </button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-0">
          <div className="flex flex-col p-2 gap-1">
            {activities.length === 0 && (
              <div className="text-sm text-taupe py-12 text-center font-normal">
                Geen recente activiteit.
              </div>
            )}
            {activities.map((activity, index) => {
              const Icon = getIcon(activity.type, activity.status)
              const colors = getColors(activity.type, activity.status)
              
              return (
                <div key={activity.id} className="group flex gap-5 p-4 mx-2 rounded-2xl hover:bg-beige-light transition-all duration-300">
                  <div
                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                      activity.status === 'approved' || activity.status === 'recovered' ? 'bg-emerald-50/50 text-emerald-700' :
                      activity.status === 'denied' ? 'bg-red-50/50 text-red-700' :
                      'bg-wheat text-espresso'
                    }`}
                  >
                    <Icon className="h-5 w-5 stroke-[1.25]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="text-base font-medium text-espresso group-hover:text-cedar transition-colors">
                      {activity.title}
                    </div>
                    <div className="text-sm text-taupe font-normal">
                      {activity.description}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-pebble font-semibold pt-1">
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
