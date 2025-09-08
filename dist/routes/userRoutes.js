"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.put("/updatepictureurl", user_controller_1.UserController.updatePictureUrl);
router.put("/updatesubscription/:id", user_controller_1.UserController.updateSubscription);
router.get("/responserate", user_controller_1.UserController.getResponseRate);
exports.default = router;
