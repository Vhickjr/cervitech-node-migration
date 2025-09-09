import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.put("/update-picture-url", UserController.updatePictureUrl);
router.put("/update-subscription/:id", UserController.updateSubscription);
router.get("/response-rate", UserController.getResponseRate);
router.put("/update-user", authenticateJWT, UserController.updateUser);

export default router;
