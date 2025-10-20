import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();


router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController.updateSubscription);

router.post("/postresponserate", UserController.postResponseRate);
router.get("/getresponserate", UserController.getResponseRate);

router.post("/toggleallowpushnotifications/:id", UserController.toggleAllowPushNotifications);
router.delete("/deleteaccount/:id", UserController.deleteById);
router.delete("/deletemyaccount", UserController.deleteMyAccount); 
router.delete("/confirmdeletemyaccount", UserController.confirmDeleteMyAccount); 
router.delete("/deleteall", UserController.deleteAll);

router.get("/getByEmail", UserController.getByEmail);
router.get("/getAllowPushNotificationStatus", UserController.getAllowPushNotificationStatus);
router.get("/getFCMToken", UserController.getFCMTokenByUsername);
router.post("/updateFCMToken", UserController.updateFCMToken);

export default router;