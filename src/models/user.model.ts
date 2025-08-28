import { Schema, model } from "mongoose";
import { IClubCreationAtr, IUserAtr } from "../common/interfaces";
import { ResourceName, UserRole } from "../common/enums";

const userSchema = new Schema<IUserAtr>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Player,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model(ResourceName.User, userSchema);
