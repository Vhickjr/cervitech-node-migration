import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();


router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription", UserController.updateSubscription);
router.get("/responserate", UserController.getResponseRate);
router.delete("/deleteaccountbyid/:id", UserController.deleteAccountbyId);
router.delete("/deleteaccountbyemail/:email", UserController.deleteAccountbyEmail);
router.post("/toggleallowpushnotifications/:id", UserController.toggleAllowPushNotifications);

router.get("/getByEmail", UserController.getByEmail);
router.get("/getAllowPushNotificationStatus", UserController.getAllowPushNotificationStatus);
router.get("/getFCMToken", UserController.getFCMTokenByUsername);
router.post("/updateFCMToken", UserController.updateFCMToken);

export default router;