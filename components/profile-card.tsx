import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-muted-foreground">Full Name</span>
          <span className="text-sm">{profile.full_name || "N/A"}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-muted-foreground">Email</span>
          <span className="text-sm">{profile.email}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-muted-foreground">Role</span>
          <span className="text-sm capitalize">{profile.role.replace("_", " ")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
