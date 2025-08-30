import { UserRepository } from "../repositories/user.repository";
import { IUserCreationAtr, IUserSaveAtr } from "../common/interfaces";
import { validateUniqueFields } from "../common/validation";
import { ValidationError, AuthenticationError } from "../common/errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { passwordConfirm, ...userData } = data;
    const user = await this.userRepository.createOne({
      ...userData,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.generateToken(user._id.toString());

    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token,
      message: "User registered successfully",
    };
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findById({ email });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    const token = jwt.sign({ id: user._id.toString() }, jwtSecret, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token,
      message: "Login successful",
    };
  }

  async refreshToken(userId: string) {
    // Check if user still exists
    const user = await this.userRepository.findById({ _id: userId });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // Generate new JWT token
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    const token = jwt.sign({ id: userId }, jwtSecret, {
      expiresIn: "7d",
    });

    return {
      token,
      message: "Token refreshed successfully",
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Find user
    const user = await this.userRepository.findById({ _id: userId });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new AuthenticationError("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userRepository.updateOne(
      { _id: userId },
      { password: hashedNewPassword }
    );

    return { message: "Password changed successfully" };
  }

  async forgotPassword(email: string) {
    // Find user by email
    const user = await this.userRepository.findById({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: "If the email exists, a reset link has been sent" };
    }

    // Generate password reset token (valid for 1 hour)
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    const resetToken = jwt.sign({ id: user._id.toString() }, jwtSecret, {
      expiresIn: "1h",
    });

    // In a real app, you would send this token via email
    // For now, we'll just return it (remove this in production)
    return {
      message: "Password reset token generated",
      resetToken, // Remove this in production
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      // Verify reset token
      const decoded = jwt.verify(
        resetToken,
        process.env.JWT_SECRET || "fallback-secret-key"
      ) as {
        id: string;
      };

      // Find user
      const user = await this.userRepository.findById({ _id: decoded.id });

      if (!user) {
        throw new AuthenticationError("Invalid or expired reset token");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.userRepository.updateOne(
        { _id: decoded.id },
        { password: hashedPassword }
      );

      return { message: "Password reset successfully" };
    } catch (error) {
      throw new AuthenticationError("Invalid or expired reset token");
    }
  }

  // Keep this simple method for backward compatibility
  private generateToken(userId: string): string {
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    return jwt.sign({ id: userId }, jwtSecret, {
      expiresIn: "7d",
    });
  }
}
