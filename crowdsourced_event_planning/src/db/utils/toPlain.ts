export type PlainObject = { [key: string]: unknown };

export function toPlain(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toPlain);
  if (obj && typeof obj === "object") {
    if (
      (obj as { _bsontype?: string; toString?: () => string })._bsontype ===
        "ObjectId" &&
      (obj as { toString?: () => string }).toString
    )
      return (obj as { toString: () => string }).toString();
    const result: PlainObject = {};
    for (const key in obj as Record<string, unknown>) {
      result[key] = toPlain((obj as Record<string, unknown>)[key]);
    }
    return result;
  }
  return obj;
}
