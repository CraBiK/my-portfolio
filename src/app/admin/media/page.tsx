import { redirect } from "next/navigation";

import { MediaGallery } from "@/components/admin/media-gallery";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { MediaRow } from "@/actions/media";

export default async function AdminMediaPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const media = await sql<MediaRow[]>`
    SELECT id, url, name, size, type, width, height, created_at
    FROM media
    ORDER BY created_at DESC
  `;

  return <MediaGallery initialMedia={media} />;
}
