import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
const wss = new WebSocketServer({ port: 8080 })

const JWT_TOKEN = process.env.JWT_SECRET_TOKEN || "helloDrawisly"

wss.on('connection', function connection(req: Request, socket: WebSocket) {
    const url = req.url;

    if (!url) {
        return;
    }
    // ws://locahost:8080?token='someting'
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";

    if (!token) {
        throw new Error(` Token is not present in ws server .`)
    }

    const decoded = jwt.verify(token, JWT_TOKEN);

    if (!decoded || !(decoded as JwtPayload).userId) {
        socket.close()
        return;
    }

    socket.on('error', console.error)

    socket.on('message', function message(event) {
        console.log(event.toString());
    })

})