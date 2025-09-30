import { Router } from "express";
import { authenticatedUser } from "../middleware/auth.middleware"
import { createRoom, fetchAllRoomOfAdminController, fetchAllRoomsOfParticipantsController, joinRoomController } from "../controllers/room.controller";

const router: Router = Router();

router.use(authenticatedUser)

router.route("/createRoom").post(createRoom);
router.route("/joinRoom").post(joinRoomController)
router.route("/adminRoom").get(fetchAllRoomOfAdminController)
router.route("/partcipantsRoom").get(fetchAllRoomsOfParticipantsController)

export default router