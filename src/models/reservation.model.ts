import mongoose, { Schema } from "mongoose";
import { IReservationAtr } from "../common/interfaces/reservation.interface";
import { ReservationStatus, ResourceName } from "../common/enums";

const reservationSchema = new Schema<IReservationAtr>(
  {
    court: { type: Schema.Types.ObjectId, ref: "Court", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.CONFIRMED,
    },
  },
  { timestamps: true }
);

export const ReservationModel = mongoose.model(
  ResourceName.Reservation,
  reservationSchema
);
