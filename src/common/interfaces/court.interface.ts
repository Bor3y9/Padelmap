import { CourtStatus } from "../enums";

export interface ICourtCreationAtr {
  name: string;
  openingHours: {
    start: string;
    end: string;
  };
  pricePerHour: number;
  club: Object;
  status?: CourtStatus;
}

export interface ICourtAtr extends ICourtCreationAtr {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
