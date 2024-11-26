import { TicketCreatedEvent } from "@frissionapps/common"
import mongoose from "mongoose"
import { JsMsg } from "nats"
import { Ticket } from "../../../models/Ticket"
import { natsWrapper } from "../../../util/NatsWrapper"
import { TicketCreatedListener } from "../TicketCreatedListener"

describe("Ticket Created Listener tests", () => {

    const setup = async () => {
        const listener = new TicketCreatedListener(natsWrapper.client)

        const data: TicketCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            title: "Title",
            price: 20,
            userId: new mongoose.Types.ObjectId().toHexString(),
        }

        const msg: JsMsg = {
            ack: jest.fn(),
            nak: jest.fn(),
        } as unknown as JsMsg

        return { listener, data, msg }
    }

    it("creates and saves a ticket", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        const ticket = await Ticket.findById(data.id)
        expect(ticket).toBeDefined()
        expect(ticket?.title).toEqual(data.title)
        expect(ticket?.price).toEqual(data.price)
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })
})
