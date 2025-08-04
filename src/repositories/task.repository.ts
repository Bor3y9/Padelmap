import { FilterQuery } from "mongoose";
import { TaskModel } from "../models/task.model";
import { ITaskAtr, ITaskCreationAtr } from "../common/interfaces";

export class TaskRepository {
  constructor() {}

  async findAll(query: FilterQuery<ITaskAtr>): Promise<ITaskAtr[]> {
    return TaskModel.find(query);
  }

  async findOne(query: FilterQuery<ITaskAtr>): Promise<ITaskAtr | null> {
    return TaskModel.findOne(query);
  }

  async createOne(data: ITaskCreationAtr): Promise<ITaskAtr> {
    const doc = new TaskModel(data);
    return doc.save();
  }

  async updateOne(
    query: FilterQuery<ITaskAtr>,
    data: Partial<ITaskCreationAtr>
  ): Promise<ITaskAtr | null> {
    return TaskModel.findOneAndUpdate(query, data, { new: true });
  }

  async deleteOne(query: FilterQuery<ITaskAtr>): Promise<ITaskAtr | null> {
    return TaskModel.findOneAndDelete(query);
  }
}
