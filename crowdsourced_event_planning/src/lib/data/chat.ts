import { ChatModel, IChat } from "@/db/models/ChatModel";

export async function getChatsByEventId(eventId: string): Promise<IChat[]> {
  return await ChatModel.getChatsByEventId(eventId);
}

export async function getChatsByWorkbookId(
  workbookId: string
): Promise<IChat[]> {
  return await ChatModel.getChatsByWorkbookId(workbookId);
}

export async function getChatsByTaskId(taskId: string): Promise<IChat[]> {
  return await ChatModel.getChatsByTaskId(taskId);
}

export async function createChat(messageData: Partial<IChat>): Promise<IChat> {
  return await ChatModel.createMessage(messageData);
}

export async function createMessage(
  messageData: Partial<IChat>
): Promise<IChat> {
  return await ChatModel.createMessage(messageData);
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  return await ChatModel.deleteMessage(messageId);
}
