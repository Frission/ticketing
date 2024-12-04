import { OrderCancelledEvent, OrderStatus } from "@frissionapps/common"
import mongoose from "mongoose"
import { JsMsg } from "nats"
import { natsWrapper } from "../../../util/NatsWrapper"
import { OrderCancelledListener } from "../OrderCancelledListener"
import { Order } from "../../../models/Order"

describe("Order Cancelled Listener tests", () => {
    const setup = async () => {
        const listener = new OrderCancelledListener(natsWrapper.client)

        const order = Order.build({
            _id: new mongoose.Types.ObjectId().toHexString(),
            status: OrderStatus.AwaitingPayment,
            version: 0,
            price: 20,
            userId: "123",
        })
        await order.save()

        const data: OrderCancelledEvent["data"] = {
            id: order.id,
            version: 1,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: new mongoose.Types.ObjectId().toHexString(),
                price: 20,
            },
        }

        const msg: JsMsg = {
            ack: jest.fn(),
            nak: jest.fn(),
        } as unknown as JsMsg

        return { listener, order, data, msg }
    }

    it("sets order status to cancelled", async () => {
        const { listener, order, data, msg } = await setup()

        await listener.onMessage(data, msg)

        const updatedOrder = await Order.findById(order.id)

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })
})
