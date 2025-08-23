import { FilterQuery } from "mongoose";
import { CourtModel } from "../models/court.model";
import { ICourtAtr, ICourtCreationAtr } from "../common/interfaces";

export class CourtRepository {
  constructor() {}

  async findAll(query: FilterQuery<ICourtAtr>): Promise<ICourtAtr[]> {
    return CourtModel.find(query).populate("club");
  }

  async findOne(query: FilterQuery<ICourtAtr>): Promise<ICourtAtr | null> {
    return CourtModel.findOne(query).populate("club");
  }

  async createOne(data: ICourtCreationAtr): Promise<ICourtAtr> {
    const doc = new CourtModel(data);
    return doc.save();
  }

  async updateOne(
    query: FilterQuery<ICourtAtr>,
    data: Partial<ICourtCreationAtr>
  ): Promise<ICourtAtr | null> {
    return CourtModel.findOneAndUpdate(query, data, { new: true });
  }

  async deleteOne(query: FilterQuery<ICourtAtr>): Promise<ICourtAtr | null> {
    return CourtModel.findOneAndDelete(query);
  }
}
