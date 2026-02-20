import { createClient } from "@/lib/supabase/server";
import { Link, redirect } from "@/i18n/routing";
import { User, Briefcase, ChevronRight, Users, ShieldCheck } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function RoleSelectionPage() {
  const supabase = await createClient();
  const t = await getTranslations("RoleSelection");
  const locale = await getLocale();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/auth/login", locale });
    return null; // Ensure TS knows execution stops or user is not null later
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Edge case: User exists but profile doesn't? Redirect to error or handle.
    redirect({ href: "/auth/login", locale });
    return null;
  }

  // If role is strictly 'employee', redirect directly to their dashboard.
  if (profile.role === 'employee') {
    redirect({ href: "/dashboard/employee", locale });
  }

  // Determine the specialized dashboard link and title based on role
  let specializedLink = "/dashboard/manager";
  let specializedTitle = t("management_dashboard");
  let specializedDescription = t("management_description");
  let specializedIcon = Briefcase;

  if (profile.role === 'hr_admin') {
    specializedLink = "/dashboard/hr";
    specializedTitle = t("hr_dashboard");
    specializedDescription = t("hr_description");
    specializedIcon = Users;
  } else if (profile.role === 'super_admin') {
    specializedLink = "/dashboard/admin";
    specializedTitle = t("admin_dashboard");
    specializedDescription = t("admin_description");
    specializedIcon = ShieldCheck;
  }
  const SpecializedIconComponent = specializedIcon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-medium text-espresso mb-4 tracking-tight">
            {t('welcome')}
          </h1>
          <p className="text-taupe text-xl font-normal">
            {t('select_continue')}
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Employee Portal Card */}
          <Link 
            href="/dashboard/employee"
            className="group block h-full"
          >
            <div className="relative h-full bg-white border-none rounded-organic shadow-organic p-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-wheat flex items-center justify-center transition-colors duration-300 group-hover:bg-cedar shadow-sm">
                    <User className="w-8 h-8 text-cedar transition-colors duration-300 group-hover:text-white stroke-[1.5]" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-3xl font-medium text-espresso mb-4 tracking-tight">
                    {t('employee_portal')}
                  </h2>
                  <p className="text-taupe leading-relaxed text-lg font-normal">
                    {t('employee_description')}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-8 flex items-center text-base font-medium text-cedar opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  <span>{t('continue')}</span>
                  <ChevronRight className="ml-2 w-5 h-5 stroke-[1.5]" />
                </div>
              </div>
            </div>
          </Link>

          {/* Specialized Dashboard Card */}
          <Link 
            href={specializedLink}
            className="group block h-full"
          >
            <div className="relative h-full bg-white border-none rounded-organic shadow-organic p-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-wheat flex items-center justify-center transition-colors duration-300 group-hover:bg-cedar shadow-sm">
                    <SpecializedIconComponent className="w-8 h-8 text-cedar transition-colors duration-300 group-hover:text-white stroke-[1.5]" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-3xl font-medium text-espresso mb-4 tracking-tight">
                    {specializedTitle}
                  </h2>
                  <p className="text-taupe leading-relaxed text-lg font-normal">
                    {specializedDescription}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-8 flex items-center text-base font-medium text-cedar opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  <span>{t('continue')}</span>
                  <ChevronRight className="ml-2 w-5 h-5 stroke-[1.5]" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-pebble font-medium tracking-wide">
            {t('need_help')} <span className="text-cedar hover:text-espresso transition-colors cursor-pointer">support@zekerhr.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
