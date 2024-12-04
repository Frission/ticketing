import { NatsListener, NatsStream, NatsSubject, OrderStatus, PaymentCreatedEvent } from "@frissionapps/common"
import { JsMsg } from "nats"
import { Order } from "../../models/Order"

export class PaymentCreatedListener extends NatsListener<PaymentCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.PaymentCreated
    readonly durableName = "orders-payment-created-listener"

    async onMessage(data: PaymentCreatedEvent["data"], msg: JsMsg): Promise<void> {
        try {
            const order = await Order.findById(data.orderId)

            if (order == null) throw new Error("Order not found")

            order.set({ status: OrderStatus.Complete })
            await order.save()

            msg.ack()
        } catch (err) {
            console.error(err)
            msg.nak()
        }
    }
}
