import { Request, Response } from "express"
import { prisma } from "@repo/db/client";

export async function fetchRoomDrawingsController(req: Request, res: Response) {
    const { roomId } = req.params;

    if(!roomId) {
        res.status(400).json({
            message : "Room Id is required."
        })
    }
    const AllDrawings = await prisma.draw.findMany({
        where : {
            roomId
        },
    })

    res.status(200).json({
        message : "All Drawing are fetched Successfully according to roomId",
        AllDrawings
    })
}