"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CerviTechDbContext = void 0;
const typeorm_1 = require("typeorm");
const BackOfficeUser_1 = __importDefault(require("../models/BackOfficeUser"));
const AppUser_1 = __importDefault(require("../models/AppUser"));
const PasswordResetToken_1 = __importDefault(require("../models/PasswordResetToken"));
const NeckAngleRecord_1 = require("../models/NeckAngleRecord");
const Goal_1 = require("../models/Goal");
const GoalCycleCompletionReport_1 = require("../models/GoalCycleCompletionReport");
const TransactionRecord_1 = __importDefault(require("../models/TransactionRecord"));
const ResponseRate_1 = __importDefault(require("../models/ResponseRate"));
exports.CerviTechDbContext = new typeorm_1.DataSource({
    type: 'mongodb', // or 'mysql', 'sqlite', etc.
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, // set to false in production
    entities: [
        BackOfficeUser_1.default,
        AppUser_1.default,
        PasswordResetToken_1.default,
        NeckAngleRecord_1.NeckAngleRecordModel,
        Goal_1.Goal,
        GoalCycleCompletionReport_1.GoalCycleCompletionReport,
        TransactionRecord_1.default,
        ResponseRate_1.default,
    ],
});
