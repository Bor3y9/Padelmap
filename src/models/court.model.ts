import { Schema, model } from "mongoose";
import { ICourtAtr } from "../common/interfaces";
import { ResourceName, CourtStatus } from "../common/enums";

const courtSchema = new Schema<ICourtAtr>(
  {
    name: { type: String, required: true },
    openingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    pricePerHour: { type: Number, required: true },
    club: {
      type: Schema.Types.ObjectId,
      ref: ResourceName.Club,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CourtStatus),
      default: CourtStatus.AVAILABLE,
    },
  },
  {
    timestamps: true,
  }
);

export const CourtModel = model(ResourceName.Court, courtSchema);
