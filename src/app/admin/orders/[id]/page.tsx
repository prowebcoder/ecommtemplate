import { notFound } from "next/navigation";
import { adminOrderService } from "@/server/services/admin-order.service";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  let order;
  try {
    order = await adminOrderService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Order {order.orderNumber}</h1>
      <p className="text-sm text-muted-foreground mb-6">{order.email}</p>
      <div className="mb-6">
        <OrderStatusSelect orderId={order.id} current={order.status} />
      </div>
      <div className="border bg-background p-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm border-b pb-3 last:border-0">
            <div>
              <p className="font-medium">{item.productTitle}</p>
              <p className="text-muted-foreground">
                {item.variantSku} · {item.colorName} / {item.sizeLabel}
                {item.vendor && ` · ${item.vendor.shopName}`}
              </p>
            </div>
            <p>
              {item.quantity} × {formatPrice(Number(item.unitPrice))}
            </p>
          </div>
        ))}
        <p className="font-semibold text-right">Total: {formatPrice(Number(order.total))}</p>
      </div>
    </div>
  );
}
