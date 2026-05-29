import { supabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/admin/slug";

const BUCKET = "product-images";

// MIME types the storage bucket actually accepts (see
// supabase/migrations/20260519084234_init_storage.sql). The browser's
// `file.type.startsWith("image/")` is broader than this list, so iPhone HEIC,
// BMP, TIFF and SVG would pass a naive client check yet get rejected by the
// bucket — surfacing as a cryptic "mime type ... is not supported" error. We
// validate against this exact list up-front and show a clear message instead.
export const ACCEPTED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

// `accept` attribute for <input type="file"> — keeps the OS picker in sync
// with what the bucket allows.
export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_MIME.join(",");

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // bucket file_size_limit

/**
 * Throws a human-readable (Russian) error if the file can't be uploaded to the
 * bucket. Call this before `uploadProductImage` / `uploadBrandLogo` so the user
 * sees "Формат HEIC не поддерживается" instead of a raw storage error.
 */
export function assertUploadableImage(file: File): void {
  if (!(ACCEPTED_IMAGE_MIME as readonly string[]).includes(file.type)) {
    const human = file.type?.split("/")[1]?.toUpperCase() || "этот формат";
    throw new Error(
      `Формат ${human} не поддерживается. Допустимы JPG, PNG, WEBP, AVIF, GIF — ` +
        `сконвертируйте фото (например, HEIC с iPhone) и загрузите снова.`,
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(
      `Файл больше 10 МБ (${(file.size / 1024 / 1024).toFixed(1)} МБ). Уменьшите размер.`,
    );
  }
}

// Collision-proof object key. `Date.now()` alone repeats within the same
// millisecond when several files are uploaded in a tight loop, so two images
// could share a path and (with upsert:true) silently overwrite each other.
function uniqueObjectName(file: File): string {
  const extension = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const rand = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${rand}.${extension || "bin"}`;
}

export type UploadResult = {
  path: string;
  publicUrl: string;
};

export async function uploadProductImage(
  file: File,
  source: string,
): Promise<UploadResult> {
  assertUploadableImage(file);
  const safePrefix = slugify(source) || "untitled";
  const path = `${safePrefix}/${uniqueObjectName(file)}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function uploadBrandLogo(
  file: File,
  source: string,
): Promise<UploadResult> {
  assertUploadableImage(file);
  const safePrefix = slugify(source) || "untitled";
  const path = `brands/${safePrefix}/${uniqueObjectName(file)}`;

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
