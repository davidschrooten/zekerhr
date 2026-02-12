import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Mail, Building, Briefcase } from "lucide-react";

export default async function EmployeeSettingsPage() {
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

  const initials = profile?.full_name 
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : user.email?.substring(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profiel & Instellingen</h1>
        <p className="text-muted-foreground mt-2">
          Beheer je persoonlijke gegevens en accountbeveiliging.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 mb-4">
                <Avatar className="w-full h-full">
                  <AvatarImage src="/avatars/01.png" alt={profile?.full_name || "User"} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{profile?.full_name || "Collega"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="mt-4 flex justify-center">
                <Badge variant="secondary" className="capitalize">
                  {profile?.role || "Medewerker"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground text-center">
              <p>Lid sinds {new Date(profile?.created_at || new Date()).toLocaleDateString("nl-NL")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Persoonlijke Gegevens</CardTitle>
              </div>
              <CardDescription>
                Je naam en contactgegevens zoals bekend bij HR.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Volledige Naam</Label>
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/50 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.full_name || "Niet ingesteld"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Emailadres</Label>
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/50 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Afdeling</Label>
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/50 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.department_id ? "Development" : "Algemeen"}</span> 
                    {/* Placeholder for department fetch */}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Functie</Label>
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/50 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{profile?.role}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 px-6 py-4 border-t">
              <p className="text-xs text-muted-foreground">
                Kloppen deze gegevens niet? Neem contact op met HR om wijzigingen door te geven.
              </p>
            </CardFooter>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Beveiliging</CardTitle>
              </div>
              <CardDescription>
                Beheer je wachtwoord en toegang.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-sm">Wachtwoord</p>
                  <p className="text-xs text-muted-foreground">
                    Verander je wachtwoord als je denkt dat dit nodig is.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/auth/update-password">Wachtwoord Wijzigen</a>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}