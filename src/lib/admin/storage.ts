import { supabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/admin/slug";

const BUCKET = "product-images";

export type UploadResult = {
  path: string;
  publicUrl: string;
};

export async function uploadProductImage(
  file: File,
  source: string,
): Promise<UploadResult> {
  const extension = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const safePrefix = slugify(source) || "untitled";
  const path = `${safePrefix}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function uploadCategoryImage(
  file: File,
  source: string,
): Promise<UploadResult> {
  const extension = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const safePrefix = slugify(source) || "untitled";
  const path = `categories/${safePrefix}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function uploadCategoryIcon(
  file: File,
  source: string,
): Promise<UploadResult> {
  if (file.type !== "image/png") {
    throw new Error("Иконка должна быть PNG с прозрачным фоном");
  }
  const safePrefix = slugify(source) || "untitled";
  const path = `categories/icons/${safePrefix}/${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: "image/png",
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function deleteProductImage(publicUrl: string | null) {
  if (!publicUrl) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return;
  const path = publicUrl.slice(index + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}
