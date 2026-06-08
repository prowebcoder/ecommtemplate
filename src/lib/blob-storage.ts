import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

export function isBlobStorageConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function uploadToBlobStorage(file: File, folder = "products") {
  if (!isBlobStorageConfigured()) {
    throw new Error("Image upload is not configured");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const pathname = `${folder}/${randomUUID()}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.type || "image/jpeg",
  });

  return blob.url;
}
