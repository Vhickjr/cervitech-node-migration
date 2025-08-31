import BackofficeUser from "../models/BackOfficeUser";
import crypto from "crypto";
class backofficeUserService {
    async create(dto) {
        // Generate salt + hash from password
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto.pbkdf2Sync(dto.password, salt, 1000, 64, "sha512").toString("hex");
        const user = new BackofficeUser({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            telephone: dto.telephone,
            username: dto.username,
            hash,
            salt,
            accessLevel: dto.accessLevel,
            readOnly: dto.readOnly ?? false,
        });
        return await user.save();
    }
    async getAll() {
        return await BackofficeUser.find();
    }
    async getByUserName(username) {
        return await BackofficeUser.findOne({ username });
    }
    async getById(id) {
        return await BackofficeUser.findById(id);
    }
    async sendPasswordResetToken(email) {
        // Generate a reset token (for simplicity, random string, but use JWT/crypto in production)
        const token = Math.random().toString(36).substr(2, 8);
        // Ideally save token to user document or a separate PasswordReset collection
        await BackofficeUser.updateOne({ email }, { resetToken: token, resetTokenExpires: Date.now() + 3600000 });
        return { email, token };
    }
    async changePassword(userId, newPassword) {
        const user = await BackofficeUser.findById(userId);
        if (!user)
            throw new Error("User not found");
        user.password = newPassword; // Make sure you hash passwords with bcrypt!
        await user.save();
        return { userId, success: true };
    }
    async resetPassword(token, newPassword) {
        const user = await BackofficeUser.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
        if (!user)
            throw new Error("Invalid or expired token");
        user.password = newPassword; // hash before saving
        await user.save();
        return { success: true };
    }
    async getNumberOfBackOfficeUsers(limit) {
        return await BackofficeUser.find().limit(limit);
    }
    async deleteById(id) {
        return await BackofficeUser.findByIdAndDelete(id);
    }
    async update(id, data) {
        console.log('Service Update - ID:', id, 'Data:', data);
        // First check if user exists
        const existingUser = await BackofficeUser.findById(id);
        console.log('Existing User:', existingUser);
        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }
        const updatedUser = await BackofficeUser.findByIdAndUpdate(id, data, { new: true });
        console.log('Updated User:', updatedUser);
        return updatedUser;
    }
}
export default new backofficeUserService();
