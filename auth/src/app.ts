import express, { json } from "express"
import "express-async-errors"

import cookieSession from "cookie-session"
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

export { app }
