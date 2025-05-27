import { Schema, Document, ObjectId } from "mongoose";

export interface IUserEvent extends Document {
  userId: ObjectId;
  eventId: ObjectId;
  joinedAt: Date;
  role: "member" | "admin";
}

const UserEventSchema = new Schema<IUserEvent>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  joinedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["member", "admin"], default: "member" },
});

UserEventSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export default UserEventSchema;
