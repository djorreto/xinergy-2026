import { redirect } from "next/navigation";
import { adminHref } from "@/lib/auth/admin-path";

export default function AdminIndexPage() {
  redirect(adminHref("/insights"));
}
