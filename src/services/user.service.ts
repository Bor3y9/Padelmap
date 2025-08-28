import { UserRepository } from "../repositories/user.repository";
import { IUserAtr, IUserCreationAtr, IUserSaveAtr } from "../common/interfaces";
import { validateUniqueFields } from "../common/validation";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
} from "../common/errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class UserService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async findAllUsers() {
    return this.userRepository.findAll({});
  }

  async findUserById(id: string) {
    return this.userRepository.findById({ _id: id });
  }
  async registerUser(data: IUserCreationAtr) {
    // Check for duplicate email and phone number
    const duplicateErrors = await validateUniqueFields({
      email: data.email,
      phoneNumber: data.phoneNumber,
    });

    if (duplicateErrors.length > 0) {
      throw new ValidationError(
        "Duplicate field validation failed",
        duplicateErrors
      );
    }

    // Check if passwords match before processing
    if (data.password !== data.passwordConfirm) {
      throw new ValidationError("Passwords are not the same", [
        { message: "Passwords are not the same", field: "passwordConfirm" },
      ]);
    }

    // hashing
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Remove passwordConfirm before saving to database
    const { passwordConfirm, ...userData } = data;
    const user = await this.userRepository.createOne({
      ...userData,
      password: hashedPassword,
    } as IUserSaveAtr);

    //jwt
    const token = jwt.sign(
      { user: user._id },
      process.env.JWT_SECRET || "default-secret",
      {
        expiresIn:
          parseInt(process.env.JWT_EXPIRES_IN as string, 10000) || "100000d",
      }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return { user: userWithoutPassword, token };
  }

  async updateUser(id: string, data: Partial<IUserSaveAtr>) {
    const duplicateErrors = await validateUniqueFields(
      {
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
      id
    );

    if (duplicateErrors.length > 0) {
      throw new ValidationError(
        "Duplicate field validation failed",
        duplicateErrors
      );
    }

    return this.userRepository.updateOne({ _id: id }, data);
  }

  async deleteUser(id: string) {
    return this.userRepository.deleteOne({ _id: id });
  }

  async loginUser(email: string, password: string) {
    // Find user by email
    const user = await this.userRepository.findById({ email });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { user: user._id },
      process.env.JWT_SECRET || "default-secret",
      {
        expiresIn:
          parseInt(process.env.JWT_EXPIRES_IN as string, 10000) || "100000d",
      }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return { user: userWithoutPassword, token };
  }
}
