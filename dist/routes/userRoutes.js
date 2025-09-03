"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
router.put("/updatepictureurl", UserController_1.UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController_1.UserController.updateSubscription);
router.get("get-response-rate/:id", UserController_1.UserController.getResponseRate);
exports.default = router;
