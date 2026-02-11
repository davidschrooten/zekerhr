import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="-mx-4 lg:w-1/5">
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/dashboard/hr">Overview</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/dashboard/hr/wkr">WKR</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/dashboard/hr/contracts">Contracts</Link>
          </Button>
        </nav>
      </aside>
      <div className="flex-1 lg:max-w-4xl">{children}</div>
    </div>
  );
}
