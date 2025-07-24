import {Router} from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.put("/updatepictureurl", UserController.updatePictureUrl);
router.put("/updatesubscription/:id", UserController.updateSubscription);
router.delete("/delete", UserController.deleteAccount);
router.get("/confirmdeletemyaccount", UserController.deleteAccountByEmail);

export default router;
