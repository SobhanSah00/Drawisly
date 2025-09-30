import { Router } from "express";
import { authenticatedUser } from "../middleware/auth.middleware"
import {fetchRoomChatsDetailsController} from "../controllers/chat.controller"

const router: Router = Router();

router.use(authenticatedUser)

router.route("/chatDetails/:roomId").get(fetchRoomChatsDetailsController)

export default router