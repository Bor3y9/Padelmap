import { ObjectId } from "mongoose";

export interface IClubCreationAtr {
  name: string;
  location: string;
  contact: {
    phone: string;
    email?: string;
  };
  owner: ObjectId;
}

export interface IClubAtr extends IClubCreationAtr {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
