"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  user: {
    email?: string;
    full_name?: string;
    initials?: string;
  };
  title: string;
  items: SidebarItem[];
}

export function AdminSidebarLayout({ children, user, title, items }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/10 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl">
             <div className="h-6 w-6 bg-black text-white rounded-full flex items-center justify-center text-xs">Z</div>
             ZekerHR
          </div>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </div>
          {items.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 mb-1",
                pathname === item.href && "bg-secondary font-medium"
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </div>

        <div className="p-4 border-t">
          <UserNav user={user} align="start" showName />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-6 md:hidden">
           {/* Mobile Header Placeholder */}
           <div className="font-bold">ZekerHR</div>
           <div className="ml-auto"><UserNav user={user} /></div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
