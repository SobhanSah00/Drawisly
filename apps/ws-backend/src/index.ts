import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080})

wss.on('connection', function connection(socket) {
    socket.on('error', console.error)

    socket.on('message', function message(event) {
        console.log(event.toString());
    })

    socket.send('someihoasdhf')
})