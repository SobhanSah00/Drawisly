import { Request, Response } from "express"
import { prisma } from "@repo/db/client";

export async function fetchRoomChatsDetailsController(req: Request, res: Response) {
    const { roomId } = req.params;
    const { cursor, limit = 5 } = req.query;

    if (!roomId) {
        res.status(400).json({
            message: "room id is not given."
        });
    }

    if (typeof roomId !== 'string') {
        res.status(400).json({
            message: "Invalid room id format."
        });
    }

    const take = Math.min(parseInt(limit as string) || 5);

    try {
        const chats = await prisma.chat.findMany({
            where: { roomId },
            take: take + 1,
            ...(cursor && {
                cursor : {
                    id : cursor as string
                },
                skip : 1
            }),
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                seriealNo: true,
                content: true,
                createdAt: true,
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });
    
        const hasMore = chats.length > take;
        const messages = hasMore ? chats.slice(0, -1) : chats;
        console.log(messages[messages.length - 1]?.id);
    
        const nextCursor = hasMore ? messages[messages.length - 1]?.id : null;
    
        res.status(200).json({
            message: "Chats fetched successfully.",
            chats: messages,
            pagination: {
                nextCursor,
                // messages,
                hasMore
            }
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({
            message: "Failed to fetch chats.",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

// const prevChats = await prisma.room.findUnique({
//     where: {
//         joincode: roomId
//     },
//     select: {
//         chat: {
//             select: {
//                 id: true,
//                 content: true,
//                 user: {
//                     select: {
//                         username: true
//                     }
//                 },

//                 createdAt: true
//             },
//             take: 50,
//             orderBy: {
//                 id: "desc"
//             }
//         }
//     }
// })