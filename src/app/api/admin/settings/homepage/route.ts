import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { toErrorResponse } from "@/server/errors/app-error";
import { z } from "zod";

const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  imageUrl: z.string().url(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "homepage.hero" },
    });
    return Response.json(setting?.value ?? null);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireSuperAdmin();
    const value = heroSchema.parse(await request.json());
    const setting = await prisma.siteSetting.upsert({
      where: { key: "homepage.hero" },
      create: { key: "homepage.hero", value },
      update: { value },
    });
    return Response.json(setting.value);
  } catch (error) {
    return toErrorResponse(error);
  }
}
