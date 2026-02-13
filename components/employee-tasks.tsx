"use client";

import React from "react"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, FileText, User, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"

interface EmployeeTasksProps {
  activeSickness: boolean;
  profileComplete: boolean;
}

export function EmployeeTasks({ activeSickness, profileComplete }: EmployeeTasksProps) {
  const tasks = [];

  if (activeSickness) {
    tasks.push({
      id: 'sick-recovery',
      title: 'Melding herstel doorgeven',
      description: 'Je staat momenteel ziek gemeld',
      icon: CheckCircle2,
      status: 'action',
      action: 'Beter melden',
      href: '/dashboard/employee/sickness',
      highlight: true,
      color: 'emerald'
    });
  }

  if (!profileComplete) {
    tasks.push({
      id: 'profile-incomplete',
      title: 'Profiel aanvullen',
      description: 'Vul je persoonlijke gegevens aan',
      icon: User,
      status: 'action',
      action: 'Aanvullen',
      href: '/dashboard/employee/settings',
      highlight: true,
      color: 'amber'
    });
  }

  // Generic/Mock tasks for filler if list is short
  if (tasks.length === 0) {
    tasks.push({
      id: 'plan-leave',
      title: 'Verlof plannen',
      description: 'Heb je al plannen voor de zomer?',
      icon: Clock,
      status: 'suggestion',
      action: 'Aanvragen',
      href: '/dashboard/employee/leave',
      highlight: false,
      color: 'blue'
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="flex flex-col gap-4 border border-border bg-card p-6 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Te doen
          </h2>
          <span className="text-sm text-muted-foreground">{tasks.length} items</span>
        </div>

        <div className="flex flex-col">
          {tasks.map((task, index) => {
            const Icon = task.icon
            return (
              <div key={task.id}>
                <div
                  className={`flex items-start justify-between gap-4 py-4 ${
                    task.highlight ? 'bg-muted/50 -mx-6 px-6' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border ${
                        task.highlight
                            ? 'border-border bg-background'
                            : 'border-border bg-muted'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          task.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-500' :
                          task.color === 'amber' ? 'text-amber-600 dark:text-amber-500' :
                          'text-muted-foreground'
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
                      asChild
                    >
                      <Link href={task.href}>{task.action}</Link>
                    </Button>
                  )}
                </div>
                {index < tasks.length - 1 && <div className="h-px bg-border" />}
              </div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
