// Generate a URL-friendly slug from a string
export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace Indonesian characters
      .replace(/[àáâãäå]/g, "a")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ñ]/g, "n")
      .replace(/[ç]/g, "c")
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9]/g, "-")
      // Remove consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-|-$/g, "")
  );
}

// Generate a unique slug by appending a timestamp or random string if needed
export function generateUniqueSlug(
  title: string,
  existingSlugs: string[] = []
): string {
  const baseSlug = generateSlug(title);

  // If the base slug is unique, return it
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  // If not unique, append current year
  const year = new Date().getFullYear();
  const slugWithYear = `${baseSlug}-${year}`;

  if (!existingSlugs.includes(slugWithYear)) {
    return slugWithYear;
  }

  // If still not unique, append timestamp
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
}

// Check if a string is a valid ObjectId (24 hex characters)
export function isValidObjectId(str: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(str);
}
