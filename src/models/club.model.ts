import { Schema, model } from "mongoose";
import { IClubAtr } from "../common/interfaces";
import { ResourceName } from "../common/enums";

const clubSchema = new Schema<IClubAtr>(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    contact: {
      phone: { type: String, required: true, unique: true },
      email: { type: String, unique: true, sparse: true },
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to handle optional email field
clubSchema.pre("save", function (next) {
  if (
    this.contact.email === undefined ||
    this.contact.email === null ||
    this.contact.email === ""
  ) {
    this.contact.email = undefined;
  }
  next();
});

// Pre-update middleware to handle optional email field
clubSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate() as any;
  if (
    (update.$set && update.$set["contact.email"] === undefined) ||
    (update.$set && update.$set["contact.email"] === null) ||
    (update.$set && update.$set["contact.email"] === "")
  ) {
    update.$unset = update.$unset || {};
    update.$unset["contact.email"] = "";
    delete update.$set["contact.email"];
  }
  next();
});

export const ClubModel = model(ResourceName.Club, clubSchema);
