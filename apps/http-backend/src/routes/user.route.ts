import { Router } from "express";
import { signUp } from "../controllers/user.controller";

const router = Router(); // ✅ Fix here

router.route("/signup").post(signUp);

export default router;
