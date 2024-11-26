import { NatsListener, NatsStream, NatsSubject, TicketUpdatedEvent } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Ticket } from "../../models/Ticket"

export class TicketUpdatedListener extends NatsListener<TicketUpdatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.TicketUpdated
    readonly durableName = "ticket-updated-durable"

    async onMessage(data: TicketUpdatedEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const { id, title, price, version } = data
            const ticket = await Ticket.findByEvent(data)
            if (ticket === null) throw new Error("Ticket not found with id: " + id + " and version: " + version)
            ticket.title = title
            ticket.price = price
            await ticket.save()
            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
