import express, { json } from "express"
import "express-async-errors"

import cookieSession from "cookie-session"
import { currentUserRouter } from "./routes/currentUser"
import { signInRouter } from "./routes/signin"
import { signOutRouter } from "./routes/signout"
import { signUpRouter } from "./routes/signup"
import { NotFoundError, errorHandler } from "@frissionapps/common"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test",
    }),
)

// Add routes
app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.all("*", () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
