import { redirect } from "next/navigation";

export default function ProtectedPage() {
  return redirect("/dashboard/employee");
}