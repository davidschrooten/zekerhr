"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard/employee"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/dashboard/employee") ? "text-primary" : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      <Link
        href="/dashboard/manager"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/dashboard/manager") ? "text-primary" : "text-muted-foreground"
        )}
      >
        Manager
      </Link>
      <Link
        href="/dashboard/hr"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/dashboard/hr") ? "text-primary" : "text-muted-foreground"
        )}
      >
        HR
      </Link>
      <Link
        href="/dashboard/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/dashboard/admin") ? "text-primary" : "text-muted-foreground"
        )}
      >
        Admin
      </Link>
    </nav>
  );
}
