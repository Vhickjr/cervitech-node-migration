"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_js_1.AuthController.signup);
router.post('/request-reset', auth_controller_js_1.AuthController.sendPasswordToken);
router.post('/reset-password', auth_controller_js_1.AuthController.resetPassword);
router.post('/login', auth_controller_js_1.AuthController.login);
exports.default = router;
