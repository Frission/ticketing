import { NatsPublisher, NatsStream, NatsSubject, OrderCreatedEvent } from "@frissionapps/common"

export class OrderCreatedPublisher extends NatsPublisher<OrderCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.OrderCreated
}
