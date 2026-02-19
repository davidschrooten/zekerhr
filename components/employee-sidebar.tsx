"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Banknote, 
  Calendar, 
  Activity, 
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function EmployeeSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard/employee", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/employee/documents", label: "Documents", icon: FileText },
    { href: "/dashboard/employee/payslips", label: "Payslips", icon: Banknote },
    { href: "/dashboard/employee/expenses", label: "Expenses", icon: CreditCard },
    { href: "/dashboard/employee/leave", label: "Leave", icon: Calendar },
    { href: "/dashboard/employee/sickness", label: "Sickness", icon: Activity },
    { href: "/dashboard/employee/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="font-mono text-xs font-bold">Z</span>
            </div>
            <span>ZekerHR</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {links.map((link, index) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                    isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
