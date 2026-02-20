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
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 bg-cream/80 px-12 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        {/* Breadcrumbs or Title could go here */}
      </div>
      <div className="flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  )
}
