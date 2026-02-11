"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav"; // We might need to adjust this

interface EmployeeLayoutProps {
  children: React.ReactNode;
  user: any; // Ideally typed from Supabase User
}

export function EmployeeLayout({ children, user }: EmployeeLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navbar */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl mr-8">
             <div className="h-6 w-6 bg-black text-white rounded-full flex items-center justify-center text-xs">Z</div>
             ZekerHR
          </div>
          
          {/* Employee Specific Navigation */}
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <Link
              href="/dashboard/employee"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard/employee" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Overview
            </Link>
            <Link
              href="/dashboard/employee/leave"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith("/dashboard/employee/leave") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Leave
            </Link>
            <Link
              href="/dashboard/employee/documents"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith("/dashboard/employee/documents") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Documents
            </Link>
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
