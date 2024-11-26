import { DatabaseConnectionError } from "@frissionapps/common"
import { app } from "./app"
import mongoose from "mongoose"
import { natsWrapper } from "./util/NatsWrapper"
import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener"
import { OrderCancelledListener } from "./events/listeners/OrderCancelledListener"

const start = async () => {
    if (!process.env.JWT_KEY) throw new Error("ENV: JWT key must be defined")
    if (!process.env.MONGO_URI) throw new Error("ENV: Mongo URI must be defined.")
    if (!process.env.NATS_URL) throw new Error("ENV: NATS URL must be defined.")

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Mongo DB")
    } catch (err) {
        console.error(err)
        throw new DatabaseConnectionError()
    }

    try {
        await natsWrapper.connect({ servers: [process.env.NATS_URL], reconnect: true })
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

        await new OrderCreatedListener(natsWrapper.client).listen()
        await new OrderCancelledListener(natsWrapper.client).listen()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000")
    })
}

start()
