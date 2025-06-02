export type PlainObject = { [key: string]: unknown };

export function toPlain(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toPlain);
  if (obj && typeof obj === "object") {
    const result: PlainObject = {};
    // Type guard to ensure obj is Record<string, unknown>
    const plainObj = obj as Record<string, unknown>;
    for (const key in plainObj) {
      if (
        plainObj[key] &&
        typeof plainObj[key] === "object" &&
        (plainObj[key] as { _bsontype?: string })._bsontype === "ObjectId"
      ) {
        result[key] = (plainObj[key] as { toString: () => string }).toString();
      } else {
        result[key] = toPlain(plainObj[key]);
      }
    }
    return result;
  }
  return obj;
}
