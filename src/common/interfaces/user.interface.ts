import { UserRole } from "../enums";

export interface IUserCreationAtr {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  role?: UserRole;
}

export interface IUserSaveAtr {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: UserRole;
}

export interface IUserAtr extends IUserSaveAtr {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
