import { Suspense } from "react";
import { LoginForm } from "@/components/account/login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign In",
  path: "/account/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-12 md:py-16">
      <h1 className="font-serif text-3xl mb-2">Sign In</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Welcome back to Veloire
      </p>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
