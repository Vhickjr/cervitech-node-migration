import {Router} from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController.updateSubscription);
router.post("/:userId/toggleallowpushnotifications", UserController.toggleAllowPushNotifications);

export default router;
