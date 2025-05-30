import { ObjectId } from "mongodb";
import CustomError from "../exceptions/CustomError";

export function validateObjectId(id: string, label = "ID") {
  if (!ObjectId.isValid(id)) {
    throw new CustomError(`Invalid ${label}`, 400);
  }
}

export function createObjectId(id?: string): ObjectId {
  if (id) {
    validateObjectId(id, "ObjectId");
    return new ObjectId(id);
  }
  return new ObjectId();
}

export function toObjectId(id: string): ObjectId {
  validateObjectId(id, "ObjectId");
  return new ObjectId(id);
}
