import Link from "next/link";
import { headers } from "next/headers";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PanelSignOutButton } from "@/components/auth/panel-sign-out-button";
import { siteConfig } from "@/config/site";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  await requireSuperAdmin();

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
          <Link href="/admin" className="font-serif text-lg shrink-0">
            {siteConfig.name} — Super Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline"
            >
              View store
            </Link>
            <PanelSignOutButton callbackUrl="/admin/login" />
          </div>
        </div>
      </header>
      <div className="container mx-auto flex gap-8 px-4 py-8">
        <aside className="hidden w-52 shrink-0 md:block">
          <AdminSidebar />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
