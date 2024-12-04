import { OrderCreatedEvent, OrderStatus } from "@frissionapps/common"
import mongoose from "mongoose"
import { JsMsg } from "nats"
import { natsWrapper } from "../../../util/NatsWrapper"
import { OrderCreatedListener } from "../OrderCreatedListener"
import { Order } from "../../../models/Order"

describe("Order Created Listener tests", () => {
    const setup = async () => {
        const listener = new OrderCreatedListener(natsWrapper.client)

        const data: OrderCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            status: OrderStatus.Created,
            ticket: {
                id: new mongoose.Types.ObjectId().toHexString(),
                price: 20,
            },
            expiresAt: new Date().toISOString(),
            userId: new mongoose.Types.ObjectId().toHexString(),
        }

        const msg: JsMsg = {
            ack: jest.fn(),
            nak: jest.fn(),
        } as unknown as JsMsg

        return { listener, data, msg }
    }

    it("creates and saves a order", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        const order = await Order.findById(data.id)
        expect(order).toBeDefined()
        expect(order?.status).toEqual(data.status)
        expect(order?.userId).toEqual(data.userId)
        expect(order?.price).toEqual(data.ticket.price)
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })
})
