"use client";

import { EmployeeSidebar } from "@/components/employee-sidebar";
import { EmployeeHeader } from "@/components/employee-header";

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
    <div className="min-h-screen bg-cream">
      <EmployeeSidebar />
      <div className="pl-64">
        <EmployeeHeader user={user} />
        <main className="p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}