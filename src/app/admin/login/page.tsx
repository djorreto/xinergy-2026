import { LoginScreen } from "@/app/admin/login/login-form";
import { adminHref } from "@/lib/auth/admin-path";

export default function AdminLoginPage() {
  return <LoginScreen home={adminHref("/insights")} />;
}
