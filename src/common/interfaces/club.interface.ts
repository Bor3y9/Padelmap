export interface IClubCreationAtr {
  name: string;
  location: string;
  contact: {
    phone: string;
    email: string;
  };
}

export interface IClubAtr extends IClubCreationAtr {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
