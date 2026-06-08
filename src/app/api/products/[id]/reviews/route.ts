import { z } from "zod";
import { getSessionUser, requireAuth } from "@/lib/auth-utils";
import { toErrorResponse } from "@/server/errors/app-error";
import { reviewService } from "@/server/services/review.service";

const upsertSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    const data = await reviewService.listForProduct(id, user?.id);
    return Response.json(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = upsertSchema.parse(await req.json());
    const review = await reviewService.upsert(id, user.id, body);
    return Response.json(review);
  } catch (error) {
    return toErrorResponse(error);
  }
}
