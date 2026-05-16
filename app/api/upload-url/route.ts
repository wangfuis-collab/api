import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createUploadUrl } from "@/lib/r2";

const schema = z.object({ fileName: z.string().min(1), contentType: z.string().min(1) });
export async function POST(request: Request) {
  const user = await requireUser();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  const key = `uploads/${user.id}/${Date.now()}-${parsed.data.fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;
  const uploadUrl = await createUploadUrl(key, parsed.data.contentType);
  return NextResponse.json({ uploadUrl, publicUrl: `${process.env.R2_PUBLIC_URL}/${key}` });
}
