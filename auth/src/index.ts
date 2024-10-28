import express, { json } from "express"
import "express-async-errors"
import { currentUserRouter } from "./routes/currentUser"
import { signInRouter } from "./routes/signin"
import { signOutRouter } from "./routes/signout"
import { signUpRouter } from "./routes/signup"
import { errorHandler } from "./middlewares/errorHandler"
import { NotFoundError } from "./errors/NotFoundError"

const app = express()
app.use(json())

// Add routes
app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.all("*", () => {
    throw new NotFoundError()
})

app.use(errorHandler)

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
