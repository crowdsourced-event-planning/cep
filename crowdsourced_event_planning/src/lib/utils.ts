import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ObjectId } from "mongodb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SerializableValue =
  | string
  | number
  | boolean
  | Date
  | ObjectId
  | null
  | undefined
  | SerializableValue[]
  | { [key: string]: SerializableValue };
type SerializedValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SerializedValue[]
  | { [key: string]: SerializedValue };

export function serializeObjectId<T extends Record<string, SerializableValue>>(
  obj: T
): Record<string, SerializedValue> {
  if (!obj) return obj;

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value instanceof ObjectId) {
      acc[key] = value.toString();
    } else if (value instanceof Date) {
      acc[key] = value.toISOString();
    } else if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        acc[key] = value.map((item) => {
          if (typeof item === "object" && item !== null) {
            return serializeObjectId(item as Record<string, SerializableValue>);
          }
          return item;
        });
      } else {
        acc[key] = serializeObjectId(
          value as Record<string, SerializableValue>
        );
      }
    } else {
      acc[key] = value as SerializedValue;
    }
    return acc;
  }, {} as Record<string, SerializedValue>);
}
