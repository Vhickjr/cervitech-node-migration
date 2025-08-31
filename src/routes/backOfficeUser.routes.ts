import { Router } from "express";
import {
  createUser,
  getBySessionUserName,
  loginController,
  forgotPassword,
  changePassword,
  resetPassword,
  getAllUsers,
  getNumberOfBackOfficeUsers,
  deleteUser,
  updateUser,
  testUserById,
} from "../controllers/backOfficeUser.controller";

const router = Router();

router.post("/", createUser);
router.post("/login", loginController)
router.get("/by-session", getBySessionUserName);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);
router.post("/reset-password", resetPassword);
router.get("/", getAllUsers);
router.get("/count/:number", getNumberOfBackOfficeUsers);
router.delete("/:id", deleteUser);
router.put("/", updateUser);
router.put("/:id", updateUser);
router.get("/test/:id", testUserById);

export default router;
