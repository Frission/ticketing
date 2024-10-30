import express, { json } from "express"
import "express-async-errors"
import mongoose from "mongoose"

import cookieSession from "cookie-session"
import { DatabaseConnectionError } from "./errors/DatabaseConnectionError"
import { NotFoundError } from "./errors/NotFoundError"
import { errorHandler } from "./middlewares/errorHandler"
import { currentUserRouter } from "./routes/currentUser"
import { signInRouter } from "./routes/signin"
import { signOutRouter } from "./routes/signout"
import { signUpRouter } from "./routes/signup"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(cookieSession({ signed: false, secure: true }))

// Add routes
app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.all("*", () => {
    throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error("JWT key must be defined")
    }

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth")
        console.log("Connected to Mongo DB")
    } catch (err) {
        console.error(err)
        throw new DatabaseConnectionError()
    }
}

app.listen(3000, async () => {
    await start()
    console.log("Listening on port 3000")
})
