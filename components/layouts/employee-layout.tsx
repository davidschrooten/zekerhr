"use client";

import { EmployeeTopNav } from "@/components/employee-top-nav";
import { EmployeeTabNav } from "@/components/employee-tab-nav";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  user: {
    email?: string;
    full_name?: string;
    initials?: string;
  };
}

export function EmployeeLayout({ children, user }: EmployeeLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation Bar */}
      <EmployeeTopNav user={user} />

      {/* Tab Navigation */}
      <EmployeeTabNav />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}