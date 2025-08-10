import { Router } from "express";
import {authenticatedUser} from "../middleware/auth.middleware"
import { signInController, signUpController ,signOutController,getCurrentUser} from "../controllers/user.controller";

const router: Router = Router(); // ✅ Fix here

router.route("/signup").post(signUpController);
router.route("/signin").post(signInController)
router.route("/signout").post(signOutController)
router.route("/getCrrUser").get(authenticatedUser,getCurrentUser)


export default router;
