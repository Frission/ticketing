import express, { json } from "express"
import { currentUserRouter } from "./routes/current-user"
import { signInRouter } from "./routes/signin"
import { signOutRouter } from "./routes/signout"
import { signUpRouter } from "./routes/signup"

const app = express()
app.use(json())

// Add routes
app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
