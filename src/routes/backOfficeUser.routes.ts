import { Router } from "express";
import BackOfficeUserController from "../controllers/backOfficeUser.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", BackOfficeUserController.createUser);
router.post("/login", BackOfficeUserController.loginController);
router.post("/forgot-password", BackOfficeUserController.forgotPassword);
router.post("/reset-password", BackOfficeUserController.resetPassword);

router.post("/logout", authenticateJWT, authorizeRole('BACKOFFICE_USER'), BackOfficeUserController.logoutController);
router.post("/change-password", authenticateJWT, authorizeRole('BACKOFFICE_USER'), BackOfficeUserController.changePassword);
router.get("/", authenticateJWT, authorizeRole('BACKOFFICE_USER'), BackOfficeUserController.getAllUsers);
router.get("/count/:number", authenticateJWT, authorizeRole('BACKOFFICE_USER'), BackOfficeUserController.getNumberOfBackOfficeUsers);
router.delete("/:id", authenticateJWT, authorizeRole('BACKOFFICE_USER'), BackOfficeUserController.deleteUser);
router.put("/:id", authenticateJWT, authorizeRole('BACKOFFICE_USER'), BackOfficeUserController.updateUser);
router.get("/test/:id", authenticateJWT, authorizeRole('BACKOFFICE_USER'), BackOfficeUserController.testUserById);

export default router;
