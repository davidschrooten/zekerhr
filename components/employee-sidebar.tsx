"use client"

import { Link, usePathname } from "@/i18n/routing"
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
    <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-sand transition-all duration-300">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-espresso">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cedar text-white shadow-organic">
              <span className="font-mono text-sm font-bold">Z</span>
            </div>
            <span className="text-xl tracking-tight">ZekerHR</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-8">
          <nav className="grid gap-2 px-4">
            {links.map((link, index) => {
              const Icon = link.icon
              const isActive = link.href === "/dashboard/employee" 
                ? pathname === link.href 
                : pathname.startsWith(link.href)
              
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white text-espresso shadow-organic" 
                      : "text-taupe hover:bg-white/50 hover:text-espresso"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "stroke-[1.5]" : "stroke-[1.25]")} />
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
