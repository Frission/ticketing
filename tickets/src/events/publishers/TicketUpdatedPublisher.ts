import { NatsPublisher, NatsStream, NatsSubject, TicketUpdatedEvent } from "@frissionapps/common"

export class TicketUpdatedPublisher extends NatsPublisher<TicketUpdatedEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.TicketUpdated
}
