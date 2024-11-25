import { NatsListener, NatsStream, NatsSubject, TicketCreatedEvent } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Ticket } from "../../models/Ticket"

export class TicketCreatedListener extends NatsListener<TicketCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.TicketCreated
    readonly durableName = "ticket-created-listener"

    async onMessage(data: TicketCreatedEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const { id, title, price } = data
            const ticket = Ticket.build({ _id: id, title, price })
            await ticket.save()
            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
