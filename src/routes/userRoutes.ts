import express from "express";
import {Router} from "express";
import {UserController} from "../controllers/user.controller";

const router = Router();
router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController.updateSubscription);
router.get("get-response-rate/:id", UserController.getResponseRate);

export default router;
