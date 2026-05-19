import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.put("/update", authenticateJWT, UserController.updateUser);

router.put("/updatepictureurl", authenticateJWT, UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController.updateSubscription);

// router.post("/postresponserate", UserController.postResponseRate);
router.get("/getresponserate", UserController.getResponseRate);
router.post('/logout', authenticateJWT, AuthController.logout);
router.get("/usernameAlreadyExists", AuthController.usernameAlreadyExists);
router.get("/isValidEmail", AuthController.isValidEmail);
router.post("/toggleallowpushnotifications/:id", UserController.toggleAllowPushNotifications);
router.delete("/deleteaccount/:id", UserController.deleteById);
router.delete("/deletemyaccount", UserController.deleteMyAccount);
router.get("/confirmdeletemyaccount", UserController.confirmDeleteMyAccount);
router.delete("/deleteall", UserController.deleteAll);
router.get("/getByEmail", UserController.getByEmail);
router.get("/getAllowPushNotificationStatus", UserController.getAllowPushNotificationStatus);
router.get("/getFCMToken", UserController.getFCMTokenByUsername);
router.put("/updateFCMToken", UserController.updateFCMToken);

export default router;