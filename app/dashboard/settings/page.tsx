import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how others will see you on the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={profile?.full_name || ""} disabled />
              <p className="text-[0.8rem] text-muted-foreground">
                Contact HR to change your name.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input defaultValue={profile?.role} disabled className="capitalize" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Update your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                    <Label className="text-base">Password</Label>
                    <p className="text-sm text-muted-foreground">
                        Protect your account with a strong password.
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <a href="/auth/update-password">Change Password</a>
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
