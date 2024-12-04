import { NatsPublisher, NatsStream, NatsSubject, PaymentCreatedEvent } from "@frissionapps/common"

export class PaymentCreatedPublisher extends NatsPublisher<PaymentCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.PaymentCreated
}
