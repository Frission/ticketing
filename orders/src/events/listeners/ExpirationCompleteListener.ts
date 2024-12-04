import { ExpirationCompleteEvent, NatsListener, NatsStream, NatsSubject, OrderStatus } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Order } from "../../models/Order"
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher"

export class ExpirationCompleteListener extends NatsListener<ExpirationCompleteEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.ExpirationComplete
    readonly durableName = "expiration-complete-durable"

    async onMessage(data: ExpirationCompleteEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const order = await Order.findById(data.orderId)

            if (order == null) throw new Error("Order not found")
                
            if (order.status == OrderStatus.Complete) {
                return msg.ack()
            }

            order.set({ status: OrderStatus.Cancelled })
            await order.save()

            new OrderCancelledPublisher(this.client).publish({
                id: order.id,
                version: order.version,
                userId: order.userId,
                expiresAt: order.expiresAt.toISOString(),
                ticket: {
                    id: order.ticket.id,
                    price: order.ticket.price,
                },
            })

            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
