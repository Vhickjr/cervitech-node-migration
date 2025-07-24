import {Router} from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.put("/updatepictureurl", (req, res, next) => {
	UserController.updatePictureUrl(req, res).catch(next);
});
router.put("/updatesubscription/:id", (req, res, next) => {
	UserController.updateSubscription(req, res).catch(next);
});
router.delete("/delete", (req, res, next) => {
	UserController.deleteUserById(req, res).catch(next);
});
router.get("/confirmdeletemyaccount", (req, res, next) => {
	UserController.deleteUserByEmail(req, res).catch(next);
});

export default router;
