// src/models/BackofficeUser.ts
import mongoose, { Schema } from "mongoose";
const BackofficeUserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String },
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    accessLevel: { type: String, required: true },
    readOnly: { type: Boolean, default: false },
});
const BackofficeUser = mongoose.model("BackofficeUser", BackofficeUserSchema);
export default BackofficeUser;
