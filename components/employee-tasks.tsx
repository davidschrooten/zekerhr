"use client";

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, User, ArrowRight } from "lucide-react"
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
      <Card className="flex flex-col h-full border-border/50 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">
              Te doen
            </CardTitle>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground">
              {tasks.length}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col">
            {tasks.map((task, index) => {
              const Icon = task.icon
              return (
                <Link 
                  key={task.id} 
                  href={task.href}
                  className={`group flex items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors ${index !== tasks.length - 1 ? 'border-b border-border/40' : ''}`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        task.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        task.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {task.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
