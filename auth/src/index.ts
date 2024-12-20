import { DatabaseConnectionError } from "@frissionapps/common"
import { app } from "./app"
import mongoose from "mongoose"

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT key must be defined.")
    }

    if (!process.env.MONGO_URI) {
        throw new Error("ENV: Mongo URI must be defined.")
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Mongo DB")
    } catch (err) {
        console.error(err)
        throw new DatabaseConnectionError()
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000")
    })
}

start()
