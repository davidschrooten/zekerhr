import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getTranslations } from "next-intl/server";

export async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations("Auth");

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      {t('welcome_user', {email: user.email || 'User'})}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">{t('sign_in')}</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">{t('sign_up')}</Link>
      </Button>
    </div>
  );
}
