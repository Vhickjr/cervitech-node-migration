import { Router } from "express";
import UserController, { getResponseRate } from "../controllers/UserController";
const router = Router();
router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController.updateSubscription);
router.get("/responserate", getResponseRate);
export default router;
