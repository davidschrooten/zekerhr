import { redirect } from "next/navigation";

export default function Home() {
  // Force redirect to login (or dashboard via middleware logic ideally)
  return redirect("/auth/login");
}
