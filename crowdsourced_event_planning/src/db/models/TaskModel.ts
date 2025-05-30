import mongoose, { model } from "mongoose";
import { dbConnect } from "../config/mongoose";
import { ITask, TaskSchema } from "../schemas/task.schema";

export class TaskModel {
  static async getTasksByWorkbookId(workbookId: string): Promise<ITask[]> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    return await Task.find({ workbookId }).sort({ createdAt: -1 });
  }

  static async getTaskById(taskId: string): Promise<ITask | null> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    return await Task.findById(taskId);
  }

  static async getSubtasks(parentTaskId: string): Promise<ITask[]> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    return await Task.find({ parentTask: parentTaskId }).sort({
      createdAt: -1,
    });
  }

  static async createTask(data: Partial<ITask>): Promise<ITask> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    const task = new Task(data);
    return await task.save();
  }

  static async updateTask(
    taskId: string,
    data: Partial<ITask>
  ): Promise<ITask | null> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    return await Task.findByIdAndUpdate(taskId, data, { new: true });
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    const result = await Task.findByIdAndDelete(taskId);
    return !!result;
  }

  static async assignUserToTask(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    return await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { assignedTo: userId } },
      { new: true }
    );
  }

  static async removeUserFromTask(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    await dbConnect();
    const Task = mongoose.models.Task || model<ITask>("Task", TaskSchema);

    return await Task.findByIdAndUpdate(
      taskId,
      { $pull: { assignedTo: userId } },
      { new: true }
    );
  }
}
