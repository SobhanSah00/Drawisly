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

export default app