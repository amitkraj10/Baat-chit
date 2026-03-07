// require("dotenv").config({path: "./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import { server } from "./socket/socket.js";

dotenv.config({
    path: "./env"
})


connectDB()
.then(() =>{
    server.listen(process.env.PORT || 8000, () =>{
         console.log(`App is listening on port no : ${process.env.PORT}`)
    })
})
.catch((error) =>{
    console.log("MongoDB connection failed  !!! ", error)
})

