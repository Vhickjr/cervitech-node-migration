import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription", UserController.updateSubscription);
router.get("/getresponserate", UserController.getResponseRate);
router.get("/postresponserate", UserController.postResponseRate);
router.get("/getByEmail", UserController.getByEmail);
router.get("/getAllowPushNotificationStatus", UserController.getAllowPushNotificationStatus);
router.get("/getFCMToken", UserController.getFCMTokenByUsername);
router.post("/updateFCMToken", UserController.updateFCMToken);

export default router;