import express from "express"
import dotenv,{config} from "dotenv"
import path from "path"

config({
    path : path.resolve(__dirname,"../../../.env")
})

const app = express()
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Express Server Listen at ${PORT}`);
})

