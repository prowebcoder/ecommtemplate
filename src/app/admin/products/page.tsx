import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { formatPrice } from "@/lib/utils";
import { ApprovalBadge } from "@/components/admin/approval-badge";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      vendor: { select: { shopName: true } },
      variants: { take: 1 },
      _count: { select: { variants: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">All products</h1>
        <Button variant="luxury" asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <div className="border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-4">Title</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Approval</th>
              <th className="p-4">Price</th>
              <th className="p-4">Variants</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4 text-muted-foreground">{p.vendor?.shopName ?? "Platform"}</td>
                <td className="p-4">
                  <ApprovalBadge status={p.approvalStatus} />
                </td>
                <td className="p-4">
                  {p.variants[0] ? formatPrice(Number(p.variants[0].price)) : "—"}
                </td>
                <td className="p-4">{p._count.variants}</td>
                <td className="p-4 flex gap-3">
                  <Link href={`/admin/products/${p.id}`} className="underline text-xs font-medium">
                    Edit
                  </Link>
                  <Link href={`/products/${p.handle}`} className="underline text-xs text-muted-foreground">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
