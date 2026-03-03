import { redirect } from "next/navigation";

// /dashboard now redirects to / (the main dashboard)
export default function DashboardRedirect() {
  redirect("/");
}
