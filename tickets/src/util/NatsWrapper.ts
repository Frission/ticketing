import { connect, ConnectionOptions, NatsConnection } from "nats"

class NatsWrapper {
    private _client: NatsConnection | undefined
    public get client() {
        if (!this._client) {
            throw new Error("Cannot access NATS client before connecting")
        }
        return this._client
    }

    async connect(opts?: ConnectionOptions) {
        this._client = await connect(opts)
        process.on("SIGINT", () => this.client.close())
        process.on("SIGTERM", () => this.client.close())
    }

    close() {
        this.client.close()
    }
}

export const natsWrapper = new NatsWrapper()
