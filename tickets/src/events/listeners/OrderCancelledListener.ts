import { NatsListener, NatsStream, NatsSubject, OrderCancelledEvent } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Ticket } from "../../models/Ticket"
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher"

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.OrderCancelled
    readonly durableName = "order-cancelled-durable"

    async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const ticket = await Ticket.findById(data.ticket.id)
            if (ticket == null) throw new Error("Ticket not found with id " + data.ticket.id)

            ticket.set({ orderId: undefined })

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
