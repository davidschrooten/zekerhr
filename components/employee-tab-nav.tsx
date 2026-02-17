'use client'

import { cn } from '@/lib/utils'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function EmployeeTabNav() {
  const pathname = usePathname()
  const t = useTranslations('EmployeeDashboard.tabs')

  const tabs = [
    { id: 'overview', label: t('overview'), href: '/dashboard/employee' },
    { id: 'payslips', label: t('payslips'), href: '/dashboard/employee/payslips' },
    { id: 'leave', label: t('leave'), href: '/dashboard/employee/leave' },
    { id: 'expenses', label: t('expenses'), href: '/dashboard/employee/expenses' },
    { id: 'sickness', label: t('sickness'), href: '/dashboard/employee/sickness' },
    { id: 'documents', label: t('documents'), href: '/dashboard/employee/documents' },
    { id: 'settings', label: t('settings'), href: '/dashboard/employee/settings' },
  ]

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto max-w-screen-2xl px-6">
        <nav className="flex gap-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            // Active if exact match OR if it's a subpath (but handle root path correctly)
            const isActive = tab.href === '/dashboard/employee' 
              ? pathname === tab.href 
              : pathname.startsWith(tab.href)
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  'relative border-b-2 px-1 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
