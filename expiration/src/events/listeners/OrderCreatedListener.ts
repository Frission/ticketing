import { NatsListener, NatsStream, NatsSubject, OrderCreatedEvent, OrderStatus } from "@frissionapps/common"
import { JsMsg } from "nats"
import { expirationQueue } from "../../queues/expirationQueue"

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.OrderCreated
    readonly durableName = "expiration-order-created-durable"

    async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg): Promise<void> {
        const delay = Math.min(10000, new Date(data.expiresAt).getTime() - new Date().getTime())
        await expirationQueue.add({ orderId: data.id }, { delay })
        console.log("Order cancellation added to queue with " + (delay / 60000).toFixed(1) + " min delay")
        msg.ack()
    }
}
