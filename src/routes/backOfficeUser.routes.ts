import { Router } from "express";
import BackOfficeUserController from "../controllers/backOfficeUser.controller";

const router = Router();

router.post("/", BackOfficeUserController.createUser);
router.post("/login", BackOfficeUserController.loginController);
router.get("/by-session", BackOfficeUserController.getBySessionUserName);
router.post("/forgot-password", BackOfficeUserController.forgotPassword);
router.post("/change-password", BackOfficeUserController.changePassword);
router.post("/reset-password", BackOfficeUserController.resetPassword);
router.get("/", BackOfficeUserController.getAllUsers);
router.get("/count/:number", BackOfficeUserController.getNumberOfBackOfficeUsers);
router.delete("/:id", BackOfficeUserController.deleteUser);
router.put("/", BackOfficeUserController.updateUser);
router.put("/:id", BackOfficeUserController.updateUser);
router.get("/test/:id", BackOfficeUserController.testUserById);

export default router;
