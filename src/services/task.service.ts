import { ITaskAtr, ITaskCreationAtr } from "../common/interfaces";
import { TaskRepository } from "../repositories/task.repository";
import { taskValidation } from "../common/validation";

export class TaskService {
  constructor(private readonly repo: TaskRepository = new TaskRepository()) {}

  async list(): Promise<ITaskAtr[]> {
    return this.repo.findAll({});
  }

  async getById(id: string): Promise<ITaskAtr | null> {
    const { error } = taskValidation.idSchema.validate({ id });
    if (error) {
      throw error;
    }
    return this.repo.findOne({ _id: id });
  }

  async createOne(data: ITaskCreationAtr): Promise<ITaskAtr> {
    const { error, value } = taskValidation.createSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      throw error;
    }

    return this.repo.createOne(value);
  }

  async updateById(
    id: string,
    data: Partial<ITaskAtr>
  ): Promise<ITaskAtr | null> {
    const { error } = taskValidation.idSchema.validate({ id });
    if (error) {
      throw error;
    }

    const { error: updateError, value } = taskValidation.updateSchema.validate(
      data,
      {
        abortEarly: false,
      }
    );

    if (updateError) {
      throw updateError;
    }

    return this.repo.updateOne({ _id: id }, value); // Use the validated value
  }

  async deleteById(id: string): Promise<ITaskAtr | null> {
    const { error } = taskValidation.idSchema.validate({ id });
    if (error) {
      throw error;
    }
    return this.repo.deleteOne({ _id: id });
  }
}
