import { natsWrapper } from "./util/NatsWrapper"

const start = async () => {
    if (!process.env.NATS_URL) throw new Error("ENV: NATS URL must be defined.")

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
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

start()
