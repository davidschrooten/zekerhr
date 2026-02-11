"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserListProps {
  users: Profile[];
}

export function UserList({ users }: UserListProps) {
  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No users found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div>
              <p className="font-medium">{user.full_name || user.email}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-secondary rounded-full capitalize">
                {user.role.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
