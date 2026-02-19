"use client";

import { Clock, Calendar, AlertCircle, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { EmployeeMetricsData } from '@/app/actions/employee'
import { motion } from 'framer-motion'

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {data.map((metric) => {
        const Icon = metric.icon
        return (
          <motion.div key={metric.label} variants={item}>
            <Card
              className="group flex flex-col justify-between gap-4 border-border/50 bg-background p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-md rounded-2xl h-full"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                {metric.status === 'success' && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Goedgekeurd
                  </span>
                )}
                {metric.status === 'warning' && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    Ziek
                  </span>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {metric.description}
                </p>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
