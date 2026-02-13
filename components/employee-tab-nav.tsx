'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { id: 'overzicht', label: 'Overzicht', href: '/dashboard/employee' },
  { id: 'loonstroken', label: 'Loonstroken', href: '/dashboard/employee/payslips' },
  { id: 'verlof', label: 'Verlof', href: '/dashboard/employee/leave' },
  { id: 'declaraties', label: 'Declaraties', href: '/dashboard/employee/expenses' },
  { id: 'verzuim', label: 'Verzuim', href: '/dashboard/employee/sickness' },
  { id: 'documenten', label: 'Documenten', href: '/dashboard/employee/documents' },
  { id: 'instellingen', label: 'Profiel & Instellingen', href: '/dashboard/employee/settings' },
]

export function EmployeeTabNav() {
  const pathname = usePathname()

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
