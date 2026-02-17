import { redirect } from "../../i18n/routing";

export default function Home() {
  // Force redirect to login (or dashboard via middleware logic ideally)
  return redirect({href: "/auth/login", locale: "en"});
}
