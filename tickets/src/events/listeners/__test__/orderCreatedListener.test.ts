import { JsMsg } from "nats"
import { Ticket } from "../../../models/Ticket"
import { natsWrapper } from "../../../util/NatsWrapper"
import { OrderCreatedListener } from "../OrderCreatedListener"
import { OrderCreatedEvent, OrderStatus } from "@frissionapps/common"
import mongoose from "mongoose"

describe("Order Created Listener tests", () => {
    const setup = async () => {
        const listener = new OrderCreatedListener(natsWrapper.client)

        const ticket = Ticket.build({
            title: "Ticket",
            price: 20,
            userId: "123",
        })
        await ticket.save()

        const data: OrderCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            status: OrderStatus.Created,
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

    it("sets the userId of the ticket", async () => {
        const { listener, ticket, data, msg } = await setup()

        await listener.onMessage(data, msg)

        const updatedTicket = await Ticket.findById(ticket.id)

        expect(updatedTicket!.orderId).toEqual(data.id)
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })
})
