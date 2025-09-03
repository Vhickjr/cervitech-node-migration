"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
const ResponseRateSchema = new mongoose_1.default.Schema({
    appUserId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'AppUser', required: true },
    prompt: { type: Number, default: 0 },
    response: { type: Number, default: 0 },
    dateCreated: { type: Date, default: Date.now }
});
const ResponseRate = mongoose_1.default.models.ResponseRate || mongoose_1.default.model("ResponseRate", ResponseRateSchema);
exports.default = ResponseRate;
