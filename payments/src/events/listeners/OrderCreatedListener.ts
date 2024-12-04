import { NatsListener, NatsStream, NatsSubject, OrderCreatedEvent } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Order } from "../../models/Order"

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.OrderCreated
    readonly durableName = "payments-order-created-durable"

    async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const order = Order.build({
                _id: data.id,
                price: data.ticket.price,
                status: data.status,
                userId: data.userId,
                version: data.version,
            })
            await order.save()
            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
