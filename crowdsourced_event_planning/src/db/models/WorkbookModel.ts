import mongoose, { model } from "mongoose";
import { dbConnect } from "../config/mongoose";
import { IWorkbook, WorkbookSchema } from "../schemas/workbook.schema";

export class WorkbookModel {
  static async getWorkbooksByEventId(eventId: string): Promise<IWorkbook[]> {
    await dbConnect();
    const Workbook =
      mongoose.models.Workbook || model<IWorkbook>("Workbook", WorkbookSchema);

    return await Workbook.find({ eventId }).sort({ createdAt: -1 });
  }

  static async getWorkbookById(workbookId: string): Promise<IWorkbook | null> {
    await dbConnect();
    const Workbook =
      mongoose.models.Workbook || model<IWorkbook>("Workbook", WorkbookSchema);

    return await Workbook.findById(workbookId);
  }

  static async createWorkbook(data: Partial<IWorkbook>): Promise<IWorkbook> {
    await dbConnect();
    const Workbook =
      mongoose.models.Workbook || model<IWorkbook>("Workbook", WorkbookSchema);

    const workbook = new Workbook(data);
    return await workbook.save();
  }

  static async updateWorkbook(
    workbookId: string,
    data: Partial<IWorkbook>
  ): Promise<IWorkbook | null> {
    await dbConnect();
    const Workbook =
      mongoose.models.Workbook || model<IWorkbook>("Workbook", WorkbookSchema);

    return await Workbook.findByIdAndUpdate(workbookId, data, { new: true });
  }
  static async deleteWorkbook(workbookId: string): Promise<boolean> {
    await dbConnect();
    const Workbook =
      mongoose.models.Workbook || model<IWorkbook>("Workbook", WorkbookSchema);

    const result = await Workbook.findByIdAndDelete(workbookId);
    return !!result;
  }

  static async create(workbookData: Partial<IWorkbook>): Promise<IWorkbook> {
    await dbConnect();
    const Workbook =
      mongoose.models.Workbook || model<IWorkbook>("Workbook", WorkbookSchema);

    const workbook = new Workbook(workbookData);
    return await workbook.save();
  }

  static async deleteMany(
    filter: Record<string, unknown> = {}
  ): Promise<boolean> {
    await dbConnect();
    const Workbook =
      mongoose.models.Workbook || model<IWorkbook>("Workbook", WorkbookSchema);

    const result = await Workbook.deleteMany(filter);
    return result.acknowledged;
  }
}
