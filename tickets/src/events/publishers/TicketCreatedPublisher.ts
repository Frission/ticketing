import { NatsPublisher, NatsStream, NatsSubject, TicketCreatedEvent } from "@frissionapps/common"

export class TicketCreatedPublisher extends NatsPublisher<TicketCreatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.TicketCreated
}
