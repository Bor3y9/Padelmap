import { ObjectId } from "mongoose";
import { ReservationStatus } from "../enums";

export interface IReservationCreationAtr {
  court: ObjectId;
  user: ObjectId;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: ReservationStatus;
}

export interface IReservationAtr extends IReservationCreationAtr {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
