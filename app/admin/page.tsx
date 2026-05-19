import { redirect } from "next/navigation";
import { isAuthenticated, loginAction } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin Login | Portfolio",
};

export default async function AdminLoginPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin password to manage content
        </p>
      </div>
      <LoginForm loginAction={loginAction} />
    </div>
  );
}
