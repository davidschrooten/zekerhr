"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface UserNavProps {
  user: {
    email?: string;
    full_name?: string;
    initials?: string;
  };
  align?: "start" | "end" | "center";
  showName?: boolean;
}

export function UserNav({ user, align = "end", showName = false }: UserNavProps) {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("Nav");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-8 ${showName ? 'w-auto px-2 gap-2' : 'w-8 rounded-full'}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt={user.email} />
            <AvatarFallback>{user.initials || "U"}</AvatarFallback>
          </Avatar>
          {showName && (
             <div className="flex flex-col items-start text-sm">
                 <span className="font-medium">{user.full_name || "User"}</span>
             </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={align} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/settings" passHref>
            <DropdownMenuItem>
              {t('settings')}
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          {t('logout')}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
