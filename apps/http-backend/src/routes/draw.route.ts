import { Router } from "express";
import { authenticatedUser } from "../middleware/auth.middleware"
import { fetchRoomDrawingsController } from "../controllers/draw.controller"

const router: Router = Router();

router.use(authenticatedUser)

router.route("/AllDraw/:roomId").get(fetchRoomDrawingsController)

export default router