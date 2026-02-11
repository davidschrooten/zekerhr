import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 border-r p-6 hidden md:block">
        <div className="font-bold text-xl mb-8">ZekerHR</div>
        <nav className="space-y-2">
          <Link href="/dashboard/employee" className="block text-sm font-medium hover:text-primary">
            My Dashboard
          </Link>
          <Link href="/dashboard/manager" className="block text-sm font-medium hover:text-primary">
            Team Management
          </Link>
          <Link href="/dashboard/hr" className="block text-sm font-medium hover:text-primary">
            HR Admin
          </Link>
          <Link href="/dashboard/admin" className="block text-sm font-medium hover:text-primary">
            System Admin
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
