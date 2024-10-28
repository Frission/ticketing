import express, { json } from "express"
import { currentUserRouter } from "./routes/currentUser"
import { signInRouter } from "./routes/signin"
import { signOutRouter } from "./routes/signout"
import { signUpRouter } from "./routes/signup"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()
app.use(json())

// Add routes
app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.use(errorHandler)

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
