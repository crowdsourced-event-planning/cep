import mongoose from "mongoose";
import CustomError from "../exceptions/CustomError";

export function validateObjectId(id: string, label = "ID") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError(`Invalid ${label}`, 400);
  }
}
