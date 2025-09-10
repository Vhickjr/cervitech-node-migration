import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription", UserController.updateSubscription);
router.get("/responserate", UserController.getResponseRate);
router.get("/getByEmail", UserController.getByEmail);
router.get("/getAllowPushNotificationStatus", UserController.getAllowPushNotificationStatus);
router.get("/getFCMToken", UserController.getFCMTokenByUsername);
router.get("/authenticate", UserController.authenticate);

export default router;