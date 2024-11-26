import { OrderCancelledEvent } from "@frissionapps/common"
import mongoose from "mongoose"
import { JsMsg } from "nats"
import { Ticket } from "../../../models/Ticket"
import { natsWrapper } from "../../../util/NatsWrapper"
import { OrderCancelledListener } from "../OrderCancelledListener"

describe("Order Cancelled Listener tests", () => {
    const setup = async () => {
        const listener = new OrderCancelledListener(natsWrapper.client)

        const ticket = Ticket.build({
            title: "Ticket",
            price: 20,
            userId: "123",
        })
        await ticket.save()

        const data: OrderCancelledEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price,
            },
        }

        const msg: JsMsg = {
            ack: jest.fn(),
            nak: jest.fn(),
        } as unknown as JsMsg

        return { listener, ticket, data, msg }
    }

    it("removes the orderId of the ticket", async () => {
        const { listener, ticket, data, msg } = await setup()

        await listener.onMessage(data, msg)

        const updatedTicket = await Ticket.findById(ticket.id)

        expect(updatedTicket!.orderId).toBeUndefined()
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })

    it("publishes a ticket updated event", async () => {
        const { listener, ticket, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(natsWrapper.client.publish).toHaveBeenLastCalledWith({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: undefined
        })
    })
})
