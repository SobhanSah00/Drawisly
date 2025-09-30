import express, { Express } from "express"
import dotenv, { config } from "dotenv"
import path from "path"
import cookieparser from "cookie-parser"
import cors from "cors"
const app: Express = express()

config({
    path: path.resolve(__dirname, "../../../.env")
})

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.urlencoded({extended : true,limit : '8mb'}))


import userRouter from "./routes/user.route"
import roomRouter from "./routes/room.route"
import chatRouter from "./routes/chat.route"
import drawRouter from "./routes/draw.route"

app.use("/api/v1/auth",userRouter)
app.use("/api/v1/room",roomRouter)
app.use("/api/v1/chat",chatRouter)
app.use("/api/v1/draw",drawRouter)

export default app