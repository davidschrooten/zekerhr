"use client"

import { UserNav } from "@/components/user-nav"

interface EmployeeHeaderProps {
  user: {
    email?: string
    full_name?: string
    initials?: string;
  }
}

export function EmployeeHeader({ user }: EmployeeHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-4">
        {/* Breadcrumbs or Title could go here */}
      </div>
      <div className="flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  )
}
