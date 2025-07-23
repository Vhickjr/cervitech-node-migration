import express from "express";
import { updatePictureUrl } from "../controllers/UserController";

const router = express.Router();

router.put("/updatepictureurl", updatePictureUrl);

export default router;
