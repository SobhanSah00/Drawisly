import { z } from "zod"

export const UserSignUpSchema = z.object({
    username : z.string().min(4).max(8),
    email : z.email(),
    password : z.string().min(6).max(10),
})

export const UserSignInSchema = z.object({
    username : z.string(),
    password : z.string().min(6)
})

export const CreateRoomSchema = z.object({
    title : z.string()
})

export const JoinRoomSchema = z.object({
    joinCode : z.string()
})

export const WebSocketMessageSchema = z.object({
    type : z.enum([
        "connect_room",
        "disconnect_room",
        "chat_message",
        "draw",
        "error_message"
    ]),
    roomId : z.string(),
    userId : z.string(),
    content : z.string().optional()
})

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>