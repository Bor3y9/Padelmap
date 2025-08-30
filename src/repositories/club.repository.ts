import { FilterQuery } from "mongoose";
import { ClubModel } from "../models/club.model";
import { IClubAtr, IClubCreationAtr } from "../common/interfaces";

export class ClubRepository {
  constructor() {}

  async findAll(query: FilterQuery<IClubAtr>): Promise<IClubAtr[]> {
    return ClubModel.find(query).populate({
      path: "owner",
      select: "name",
    });
  }

  async findOne(query: FilterQuery<IClubAtr>): Promise<IClubAtr | null> {
    return ClubModel.findOne(query).populate({
      path: "owner",
      select: "name",
    });
  }

  async createOne(data: IClubCreationAtr): Promise<IClubAtr> {
    const doc = new ClubModel(data);
    return doc.save();
  }

  async updateOne(
    query: FilterQuery<IClubAtr>,
    data: Partial<IClubCreationAtr>
  ): Promise<IClubAtr | null> {
    return ClubModel.findOneAndUpdate(query, data, { new: true });
  }

  async deleteOne(query: FilterQuery<IClubAtr>): Promise<IClubAtr | null> {
    return ClubModel.findOneAndDelete(query);
  }
}
