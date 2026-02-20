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
              className="group flex flex-col justify-between gap-6 border-none bg-white p-8 shadow-organic transition-all hover:shadow-lg hover:-translate-y-1 rounded-organic h-full"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-taupe group-hover:bg-cedar group-hover:text-white transition-colors duration-300">
                  <Icon className="h-6 w-6 stroke-[1.25]" />
                </div>
                {metric.status === 'success' && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50/50 px-3 py-1 text-xs font-medium text-emerald-700 ring-0">
                    Goedgekeurd
                  </span>
                )}
                {metric.status === 'warning' && (
                  <span className="inline-flex items-center rounded-full bg-amber-50/50 px-3 py-1 text-xs font-medium text-amber-700 ring-0">
                    Ziek
                  </span>
                )}
              </div>
              <div>
                <div className="text-3xl font-medium tracking-tight text-espresso">
                  {metric.value}
                </div>
                <p className="text-sm text-taupe mt-1 font-normal tracking-wide">
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
