import { DatabaseConnectionError } from "@frissionapps/common"
import { app } from "./app"
import mongoose from "mongoose"
import { natsWrapper } from "./util/NatsWrapper"

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("ENV: JWT key must be defined")
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

    try {
        await natsWrapper.connect({ servers: "localhost:4222" })
        natsWrapper.client
            .closed()
            .then(() => {
                console.log("NATS client closed down!")
                process.exit(1)
            })
            .catch((err) => {
                console.error(err)
                process.exit(1)
            })
        console.log("Connected to NATS Server")
    } catch (err) {
        console.error(err)
        throw new Error("Failed to connect to NATS")
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000")
    })
}

start()
