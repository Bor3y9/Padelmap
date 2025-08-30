import { FilterQuery } from "mongoose";
import { IReservationAtr, IReservationCreationAtr } from "../common/interfaces";
import { ReservationModel } from "../models/reservation.model";

export class ReservationRepository {
  constructor() {}

  async findAll(
    query: FilterQuery<IReservationAtr>
  ): Promise<IReservationAtr[]> {
    return ReservationModel.find(query)
      .populate({
        path: "user",
        select: "name email phoneNumber",
      })
      .populate({
        path: "court",
        select: "name type pricePerHour",
        populate: {
          path: "club",
          select: "name location",
        },
      })
      .sort({ startTime: 1 });
  }

  async findById(
    query: FilterQuery<IReservationAtr>
  ): Promise<IReservationAtr | null> {
    return ReservationModel.findOne(query)
      .populate({
        path: "user",
        select: "name email phoneNumber",
      })
      .populate({
        path: "court",
        select: "name type pricePerHour",
        populate: {
          path: "club",
          select: "name location",
        },
      });
  }
  async createOne(data: IReservationCreationAtr): Promise<IReservationAtr> {
    const doc = new ReservationModel(data);
    return await doc.save();
  }
  async updateOne(
    query: FilterQuery<IReservationAtr>,
    data: Partial<IReservationAtr>
  ): Promise<IReservationAtr | null> {
    return ReservationModel.findOneAndUpdate(query, data, { new: true });
  }
  async deleteOne(
    query: FilterQuery<IReservationAtr>
  ): Promise<IReservationAtr | null> {
    return ReservationModel.findOneAndDelete(query);
  }
}
