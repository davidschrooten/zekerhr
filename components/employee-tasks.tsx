"use client";

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, User, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
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
      className="h-full"
    >
      <Card className="flex flex-col h-full border-none bg-white shadow-organic rounded-organic overflow-hidden">
        <CardHeader className="border-b-0 px-8 py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-espresso tracking-tight">
              Te doen
            </CardTitle>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wheat text-xs font-bold text-espresso">
              {tasks.length}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1">
          <div className="flex flex-col p-2 gap-2">
            {tasks.map((task, index) => {
              const Icon = task.icon
              return (
                <Link 
                  key={task.id} 
                  href={task.href}
                  className="group flex items-center justify-between gap-4 p-4 mx-2 rounded-2xl hover:bg-beige-light transition-all duration-300"
                >
                  <div className="flex gap-5 items-center">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                        task.color === 'emerald' ? 'bg-emerald-50/50 text-emerald-700' :
                        task.color === 'amber' ? 'bg-amber-50/50 text-amber-700' :
                        'bg-blue-50/50 text-blue-700'
                      }`}
                    >
                      <Icon className="h-6 w-6 stroke-[1.25]" />
                    </div>
                    <div className="flex flex-col justify-center gap-0.5">
                      <div className="text-base font-medium text-espresso group-hover:text-cedar transition-colors">
                        {task.title}
                      </div>
                      <div className="text-sm text-taupe font-normal">
                        {task.description}
                      </div>
                    </div>
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white opacity-0 group-hover:opacity-100 shadow-sm transition-all duration-300">
                    <ArrowRight className="h-4 w-4 text-cedar stroke-[1.5]" />
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
