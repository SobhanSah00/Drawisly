import app from "./app";
import { prisma } from "@repo/db/client"
const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
    console.log(`Express Server Listen at ${PORT}`);
})

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0))
})