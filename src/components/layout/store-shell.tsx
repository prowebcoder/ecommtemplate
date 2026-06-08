import { Suspense } from "react";
import { headers } from "next/headers";
import { HeaderFallback } from "@/components/layout/header-fallback";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";

export async function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPanel = pathname.startsWith("/admin") || pathname.startsWith("/vendor");

  if (isPanel) {
    return <>{children}</>;
  }

  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <StoreHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <StoreFooter />
      </Suspense>
    </>
  );
}
