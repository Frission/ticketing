import { TicketUpdatedEvent } from "@frissionapps/common"
import mongoose from "mongoose"
import { JsMsg } from "nats"
import { Ticket } from "../../../models/Ticket"
import { natsWrapper } from "../../../util/NatsWrapper"
import { TicketUpdatedListener } from "../TicketUpdatedListener"

describe("Ticket Updated Listener tests", () => {

    const setup = async () => {
        const ticket = Ticket.build({ title: "Title", price: 20 })
        await ticket.save()

        const listener = new TicketUpdatedListener(natsWrapper.client)

        const data: TicketUpdatedEvent["data"] = {
            id: ticket.id,
            version: 1,
            title: "Title 2",
            price: 30,
            userId: new mongoose.Types.ObjectId().toHexString(),
        }

        const msg: JsMsg = {
            ack: jest.fn(),
            nak: jest.fn(),
        } as unknown as JsMsg

        return { ticket, listener, data, msg }
    }

    it("updates a ticket", async () => {
        const { ticket, listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        const updatedTicket = await Ticket.findById(ticket.id)
        expect(updatedTicket).toBeDefined()
        expect(updatedTicket?.title).toEqual(data.title)
        expect(updatedTicket?.price).toEqual(data.price)
        expect(updatedTicket?.version).toEqual(data.version)
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup()

        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })

    it("does not ack message if the event has skipped a version number", async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
        
        const { listener, data, msg } = await setup()

        data.version = 10

        try {
            await listener.onMessage(data, msg)
        } catch { /* do nothing */ }

        expect(msg.ack).not.toHaveBeenCalled()
        expect(msg.nak).toHaveBeenCalled()

        spy.mockRestore()
    })
})
