export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Ganti karakter non-alphanumeric dengan "-"
    .replace(/^-+|-+$/g, ""); // Hapus "-" di awal/akhir
}
