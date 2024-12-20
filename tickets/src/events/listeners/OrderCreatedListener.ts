import { NatsListener, NatsStream, NatsSubject, OrderCreatedEvent } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Ticket } from "../../models/Ticket"
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher"

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.OrderCreated
    readonly durableName = "order-created-durable"

    async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const ticket = await Ticket.findById(data.ticket.id)
            if (ticket == null) throw new Error("Ticket not found with id " + data.ticket.id)

            ticket.set({ orderId: data.id })

            await ticket.save()
            await new TicketUpdatedPublisher(this.client).publish({
                id: ticket.id,
                version: ticket.version,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                orderId: ticket.orderId
            })
            
            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
