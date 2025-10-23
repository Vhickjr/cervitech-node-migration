import BackofficeUser, { IBackofficeUser } from "../models/BackOfficeUser";
import { backOfficeUserModel } from "../types/backOfficeUserModel.types";
import { HashUtil } from "../utils/hash";
import { TokenUtil } from "../utils/token.util";
import TokenBlacklist from "../models/TokenBlacklist";
import crypto from "crypto";

class BackofficeUserService {
  static async create(dto: backOfficeUserModel) {
    const hashedPassword = await HashUtil.hash(dto.password);

    const user = new BackofficeUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      telephone: dto.telephone,
      username: dto.username,
      password: hashedPassword,
      accessLevel: dto.accessLevel,
      readOnly: dto.readOnly ?? false,
    });

    return await user.save();
  }

  static async loginService(username: string, password: string) {
    const user = await BackofficeUser.findOne({ username });
    if (!user) throw new Error("Invalid username or password");

    const isValid = await HashUtil.compare(password, user.password);
    if (!isValid) throw new Error("Invalid username or password");

    const token = TokenUtil.generateBackofficeUserToken(user);

    return { user, token };
  }


  static async logoutService(token: string) {
    if (!token) throw new Error("Token required for logout");

    // prevent duplicate blacklist entries
    const existing = await TokenBlacklist.findOne({ token });
    if (!existing) {
      await TokenBlacklist.create({ token });
    }

    return { success: true, message: "User logged out successfully" };
  }

  static async changePassword(userId: string, newPassword: string) {
    const user = await BackofficeUser.findById(userId);
    if (!user) throw new Error("User not found");

    user.password = await HashUtil.hash(newPassword);
    await user.save();

    return { userId, success: true };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await BackofficeUser.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalid or expired token");

    user.password = await HashUtil.hash(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();
    return { success: true };
  }

  static async sendPasswordResetToken(email: string) {
    const user = await BackofficeUser.findOne({ email });
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(32).toString("hex");

    await BackofficeUser.updateOne(
      { email },
      { resetToken: token, resetTokenExpires: Date.now() + 3600000 }
    );

    return { email, token };
  }

  static async getAll() {
    return await BackofficeUser.find();
  }

  static async getByUserName(username: string) {
    return await BackofficeUser.findOne({ username });
  }

  static async getById(id: string) {
    return await BackofficeUser.findById(id);
  }

  static async getNumberOfBackOfficeUsers(limit: number) {
    if (limit <= 0) {
      throw new Error("Specify a valid limit greater than zero");
    }
    return await BackofficeUser.find().limit(limit);
  }

  static async deleteById(id: string) {
    return await BackofficeUser.findByIdAndDelete(id);
  }

  static async update(id: string, data: Partial<IBackofficeUser>) {
    const existingUser = await BackofficeUser.findById(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser = await BackofficeUser.findByIdAndUpdate(id, data, {
      new: true,
    });

    return updatedUser;
  }
}

export default BackofficeUserService;
