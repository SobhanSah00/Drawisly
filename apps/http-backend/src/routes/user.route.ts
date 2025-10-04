import { Router } from "express";
import { authenticatedUser } from "../middleware/auth.middleware"
import { signInController, signUpController, signOutController, getCurrentUser,getToken } from "../controllers/user.controller";

const router: Router = Router(); 

router.route("/signup").post(signUpController);
router.route("/signin").post(signInController)
router.route("/signout").post(signOutController)
router.route("/getCrrUser").get(authenticatedUser, getCurrentUser)
router.route("/getToken").get(authenticatedUser,getToken)

export default router;
