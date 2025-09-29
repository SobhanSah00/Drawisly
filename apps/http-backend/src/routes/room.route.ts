import { Router } from "express";
import { authenticatedUser } from "../middleware/auth.middleware"
import { createRoom, fetchAllRoomsController, joinRoomController } from "../controllers/room.controller";

const router: Router = Router();

router.use(authenticatedUser)

router.route("/createRoom").post(createRoom);
router.route("/joinRoom").post(joinRoomController)
router.route("/allRoom").get(fetchAllRoomsController)

export default router