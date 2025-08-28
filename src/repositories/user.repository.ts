import { FilterQuery } from "mongoose";
import { IUserAtr, IUserCreationAtr, IUserSaveAtr } from "../common/interfaces";
import { UserModel } from "../models/user.model";

export class UserRepository {
  constructor() {}

  async findAll(query: FilterQuery<IUserAtr>) {
    return UserModel.find(query);
  }
  async findById(query: FilterQuery<IUserAtr>) {
    return UserModel.findOne(query);
  }
  async createOne(data: IUserSaveAtr) {
    const doc = new UserModel(data);
    return await doc.save();
  }
  async updateOne(query: FilterQuery<IUserAtr>, data: Partial<IUserSaveAtr>) {
    return UserModel.updateOne(query, data);
  }
  async deleteOne(query: FilterQuery<IUserAtr>) {
    return UserModel.deleteOne(query);
  }
}
