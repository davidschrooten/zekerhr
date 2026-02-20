import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Mail, Building, Briefcase } from "lucide-react";
import { AnimatePage } from "@/components/animate-page";
import { Link } from "@/i18n/routing";

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
    <AnimatePage className="mx-auto max-w-screen-2xl px-8 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-espresso">Profiel & Instellingen</h1>
        <p className="text-lg text-taupe mt-2 font-normal">
          Beheer je persoonlijke gegevens en accountbeveiliging.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-organic rounded-organic bg-white">
            <CardHeader className="text-center pt-8 px-8">
              <div className="mx-auto w-32 h-32 mb-6">
                <Avatar className="w-full h-full shadow-lg ring-4 ring-cream">
                  <AvatarImage src="/avatars/01.png" alt={profile?.full_name || "User"} />
                  <AvatarFallback className="text-3xl bg-wheat text-cedar font-medium">{initials}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-medium text-espresso">{profile?.full_name || "Collega"}</CardTitle>
              <CardDescription className="text-taupe font-normal">{user.email}</CardDescription>
              <div className="mt-6 flex justify-center">
                <Badge variant="secondary" className="capitalize rounded-full px-4 py-1.5 bg-wheat text-espresso font-medium shadow-sm">
                  {profile?.role || "Medewerker"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-taupe text-center pb-8 font-normal">
              <p>Lid sinds {new Date(profile?.created_at || new Date()).toLocaleDateString("nl-NL")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Information */}
          <Card className="border-none shadow-organic rounded-organic bg-white">
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-wheat flex items-center justify-center text-cedar shadow-sm">
                    <User className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-medium text-espresso">Persoonlijke Gegevens</CardTitle>
              </div>
              <CardDescription className="text-taupe font-normal pl-13">
                Je naam en contactgegevens zoals bekend bij HR.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-taupe font-semibold">Volledige Naam</Label>
                  <div className="flex items-center gap-3 border-none rounded-2xl px-4 py-3 bg-cream shadow-inner text-sm text-espresso">
                    <User className="h-4 w-4 text-cedar" />
                    <span className="font-medium">{profile?.full_name || "Niet ingesteld"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-taupe font-semibold">Emailadres</Label>
                  <div className="flex items-center gap-3 border-none rounded-2xl px-4 py-3 bg-cream shadow-inner text-sm text-espresso">
                    <Mail className="h-4 w-4 text-cedar" />
                    <span className="font-medium">{user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-taupe font-semibold">Afdeling</Label>
                  <div className="flex items-center gap-3 border-none rounded-2xl px-4 py-3 bg-cream shadow-inner text-sm text-espresso">
                    <Building className="h-4 w-4 text-cedar" />
                    <span className="font-medium">{profile?.department_id ? "Development" : "Algemeen"}</span> 
                    {/* Placeholder for department fetch */}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-taupe font-semibold">Functie</Label>
                  <div className="flex items-center gap-3 border-none rounded-2xl px-4 py-3 bg-cream shadow-inner text-sm text-espresso">
                    <Briefcase className="h-4 w-4 text-cedar" />
                    <span className="capitalize font-medium">{profile?.role}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-cream/30 px-8 py-6 rounded-b-organic">
              <p className="text-xs text-taupe font-medium">
                Kloppen deze gegevens niet? Neem contact op met HR om wijzigingen door te geven.
              </p>
            </CardFooter>
          </Card>

          {/* Security */}
          <Card className="border-none shadow-organic rounded-organic bg-white">
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-10 w-10 rounded-xl bg-wheat flex items-center justify-center text-cedar shadow-sm">
                    <Lock className="h-5 w-5" />
                 </div>
                <CardTitle className="text-xl font-medium text-espresso">Beveiliging</CardTitle>
              </div>
              <CardDescription className="text-taupe font-normal pl-13">
                Beheer je wachtwoord en toegang.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-cream/50 border border-white shadow-sm">
                <div className="space-y-1">
                  <p className="font-medium text-espresso">Wachtwoord</p>
                  <p className="text-sm text-taupe">
                    Verander je wachtwoord als je denkt dat dit nodig is.
                  </p>
                </div>
                <Button variant="outline" className="rounded-full border-none bg-white shadow-sm hover:bg-wheat text-espresso hover:text-cedar font-medium" asChild>
                  <Link href="/auth/update-password">Wachtwoord Wijzigen</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AnimatePage>
  );
}