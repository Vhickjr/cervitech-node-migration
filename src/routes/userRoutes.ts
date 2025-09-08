import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController.updateSubscription);
router.get("/responserate", UserController.getResponseRate);
router.delete("/deleteaccountbyid/:id", UserController.deleteAccountbyId);
router.delete("/deleteaccountbyemail/:email", UserController.deleteAccountbyEmail);

export default router;
