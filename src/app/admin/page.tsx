import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [orders, revenue, customers, products, lowStock, vendors, pending] =
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
    ]);

  const stats = [
    { label: "Total orders", value: String(orders) },
    { label: "Revenue", value: formatPrice(Number(revenue._sum.total ?? 0)) },
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`border bg-background p-6 ${s.highlight ? "border-amber-400" : ""}`}
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink href="/admin/products/new" label="Add product" />
        <QuickLink href="/admin/vendors" label="Manage vendors" />
        <QuickLink href="/admin/orders" label="View orders" />
        <QuickLink href="/admin/customers" label="Customers" />
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border bg-background p-4 text-sm font-medium hover:border-primary transition-colors"
    >
      {label} →
    </Link>
  );
}
