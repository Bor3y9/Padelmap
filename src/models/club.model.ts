import { Schema, model } from "mongoose";
import { IClubAtr } from "../common/interfaces";
import { ResourceName } from "../common/enums";

const clubSchema = new Schema<IClubAtr>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const ClubModel = model(ResourceName.Club, clubSchema);
