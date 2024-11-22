import { NatsPublisher, NatsStream, NatsSubject, OrderCancelledEvent } from "@frissionapps/common"

export class OrderCancelledPublisher extends NatsPublisher<OrderCancelledEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.OrderCancelled
}
