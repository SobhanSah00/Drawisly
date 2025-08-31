import {Request,Response} from "express"
import {reandomeCodeGenerator} from "../utils/randomRoomCodeGenerate"
import { prisma } from "@repo/db/client";

export async function createRoom(req: Request, res :Response) {
    try {
        const userId = req.userId;
        const roomCode : string = reandomeCodeGenerator(7);

        if(!userId) {
            res.status(401).json({
                message : "User Id is not Found ."
            })
            return;
        }

        if(!roomCode) {

        }
        const room = await prisma.room.create({
            data : {
                title : req.body.title,
                joincode : roomCode,
                adminId : userId,
                participants : {
                    connect : [
                        {
                            id : userId
                        }
                    ]
                }
            }
        })
    }
    catch(err) {

    }
}