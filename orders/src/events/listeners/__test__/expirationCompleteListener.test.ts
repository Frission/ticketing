import mongoose from "mongoose"
import { Ticket } from "../../../models/Ticket"
import { natsWrapper } from "../../../util/NatsWrapper"
import { ExpirationCompleteListener } from "../ExpirationCompleteListener"
import { Order } from "../../../models/Order"
import { ExpirationCompleteEvent, OrderStatus } from "@frissionapps/common"
import type { JsMsg } from "nats"

describe("Expiration Complete Listener tests", () => {
    const setup = async () => {
        const listener = new ExpirationCompleteListener(natsWrapper.client)

        const ticket = Ticket.build({
            _id: new mongoose.Types.ObjectId().toHexString(),
            title: "Concert",
            price: 20,
        })
        await ticket.save()

        const order = Order.build({
            status: OrderStatus.Created,
            userId: "123",
            expiresAt: new Date(),
            ticket,
        })
        await order.save()

        const data: ExpirationCompleteEvent["data"] = {
            orderId: order.id,
        }

        const msg: JsMsg = {
            ack: jest.fn(),
            nak: jest.fn(),
        } as unknown as JsMsg

        return { listener, ticket, order, data, msg }
    }

    it("updates the order status to be cancelled", async () => {
        const { listener, order, data, msg } = await setup()

        await listener.onMessage(data, msg)

        const updatedOrder = await Order.findById(order.id)

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
    })

    it("emits an OrderCancelled event", async () => {
        const { listener, order, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(natsWrapper.client.publish).toHaveBeenCalled()

        const eventData = (natsWrapper.client.publish as jest.Mock).mock.calls[1][0]
        expect(eventData.id).toEqual(order.id)
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })
})
