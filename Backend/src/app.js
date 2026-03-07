import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// const app = express()

import { app } from "./socket/socket.js"

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import messageRoutes from './routes/message.routes.js'
import aiChatRoutes from './routes/ai.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/ai", aiChatRoutes)


export { app } 