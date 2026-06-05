import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const [orders, revenue, customers, products, lowStock, vendors, pending, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "FULFILLED"] } },
        _sum: { total: true },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { approvalStatus: "APPROVED", isActive: true } }),
      prisma.inventory.count({ where: { quantity: { lte: 5 } } }),
      prisma.vendor.count({ where: { status: "ACTIVE" } }),
      prisma.product.count({ where: { approvalStatus: "PENDING_REVIEW" } }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          payments: { take: 1 },
          _count: { select: { items: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Total orders", value: String(orders) },
    { label: "Revenue (paid)", value: formatPrice(Number(revenue._sum.total ?? 0)) },
    { label: "Customers", value: String(customers) },
    { label: "Live products", value: String(products) },
    { label: "Active vendors", value: String(vendors) },
    { label: "Pending approval", value: String(pending), highlight: pending > 0 },
    { label: "Low stock SKUs", value: String(lowStock) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-serif text-3xl">Platform dashboard</h1>
        {pending > 0 && (
          <Button variant="luxury" asChild>
            <Link href="/admin/products/pending">Review {pending} products</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`border bg-background p-5 rounded-sm ${s.highlight ? "border-amber-400" : ""}`}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 border bg-background rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-muted-foreground hover:underline">
              View all
            </Link>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-4">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline">
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.email}</p>
                  </td>
                  <td className="p-4 text-muted-foreground capitalize">
                    {o.payments[0]?.provider === "COD" ? "COD" : o.payments[0]?.provider ?? "—"}
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      {o.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-medium">{formatPrice(Number(o.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!recentOrders.length && (
            <p className="p-8 text-center text-muted-foreground text-sm">No orders yet.</p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="font-medium mb-2">Quick actions</h2>
          <QuickLink href="/admin/products/new" label="Add product" />
          <QuickLink href="/admin/coupons" label="Manage coupons" />
          <QuickLink href="/admin/vendors" label="Manage vendors" />
          <QuickLink href="/admin/content" label="Homepage & size chart" />
          <QuickLink href="/admin/orders" label="All orders" />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block border bg-background p-4 text-sm font-medium rounded-sm hover:border-foreground/30 transition-colors"
    >
      {label} →
    </Link>
  );
}
