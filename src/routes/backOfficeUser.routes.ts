import { Router } from "express";
import BackOfficeUserController from "../controllers/backOfficeUser.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", BackOfficeUserController.createUser);
router.post("/login", BackOfficeUserController.loginController);
router.post("/forgot-password", BackOfficeUserController.forgotPassword);
router.post("/reset-password", BackOfficeUserController.resetPassword);
router.post("/logout", authenticateJWT, BackOfficeUserController.logoutController);
router.post("/change-password", authenticateJWT, BackOfficeUserController.changePassword);
router.get("/", authenticateJWT, BackOfficeUserController.getAllUsers);
router.get("/count/:number", authenticateJWT, BackOfficeUserController.getNumberOfBackOfficeUsers);
router.delete("/:id", authenticateJWT, BackOfficeUserController.deleteUser);
router.put("/:id", authenticateJWT, BackOfficeUserController.updateUser);
router.get("/test/:id", authenticateJWT, BackOfficeUserController.testUserById);

export default router;
