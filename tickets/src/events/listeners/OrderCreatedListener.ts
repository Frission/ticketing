import { NatsListener, NatsStream, NatsSubject, OrderCreatedEvent, OrderStatus } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Ticket } from "../../models/Ticket"

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
            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
