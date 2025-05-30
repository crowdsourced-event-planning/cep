import mongoose, { model } from "mongoose";
import { dbConnect } from "../config/mongoose";
import { IChat, ChatSchema } from "../schemas/chat.schema";

export class ChatModel {
  static async getChatsByEventId(eventId: string): Promise<IChat[]> {
    await dbConnect();
    const Chat = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);

    return await Chat.find({ eventId }).sort({ createdAt: 1 });
  }

  static async getChatsByWorkbookId(workbookId: string): Promise<IChat[]> {
    await dbConnect();
    const Chat = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);

    return await Chat.find({ workbookId }).sort({ createdAt: 1 });
  }

  static async getChatsByTaskId(taskId: string): Promise<IChat[]> {
    await dbConnect();
    const Chat = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);

    return await Chat.find({ taskId }).sort({ createdAt: 1 });
  }

  static async createMessage(data: Partial<IChat>): Promise<IChat> {
    await dbConnect();
    const Chat = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);

    const message = new Chat(data);
    return await message.save();
  }

  static async deleteMessage(messageId: string): Promise<boolean> {
    await dbConnect();
    const Chat = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);

    const result = await Chat.findByIdAndDelete(messageId);
    return !!result;
  }
}
