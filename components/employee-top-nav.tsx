'use client'

import { Search, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserNav } from '@/components/user-nav'

interface EmployeeTopNavProps {
  user: {
    email?: string
    full_name?: string
    initials?: string
  }
}

export function EmployeeTopNav({ user }: EmployeeTopNavProps) {
  return (
    <nav className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Left Section - Logo & Breadcrumbs */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background">
            <span className="font-mono text-xs font-bold">Z</span>
          </div>
          <span className="font-semibold text-foreground">ZekerHR</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>/</span>
          <span className="text-foreground">{user.full_name || user.email}</span>
        </div>
      </div>

      {/* Right Section - Search, Feedback, Profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoeken..."
            className="h-8 w-64 border-border bg-background pl-8 text-sm"
          />
        </div>

        {/* Feedback Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-sm font-normal text-foreground"
        >
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>

        {/* User Profile */}
        <UserNav user={user} />
      </div>
    </nav>
  )
}
