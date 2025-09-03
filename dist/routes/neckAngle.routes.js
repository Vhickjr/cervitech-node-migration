"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/neckAngleRoutes.ts
const express_1 = __importDefault(require("express"));
const neckAngle_controller_1 = require("../controllers/neckAngle.controller");
const router = express_1.default.Router();
router.post('/neckangle/postBatchNeckAngleRecords', neckAngle_controller_1.NeckAngleController.postBatchNeckAngleRecords);
router.post('/neckangle/postrandomneckanglerecords', neckAngle_controller_1.NeckAngleController.postRandomTestBatchNeckAngleRecords);
exports.default = router;
