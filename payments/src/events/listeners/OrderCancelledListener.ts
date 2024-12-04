import { NatsListener, NatsStream, NatsSubject, OrderCancelledEvent, OrderStatus } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Order } from "../../models/Order"

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.OrderCancelled
    readonly durableName = "order-cancelled-durable"

    async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const order = await Order.findByEvent(data)

            if(order == null) throw new Error("Order not found")

            order.set({ status: OrderStatus.Cancelled })
            await order.save()
            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
