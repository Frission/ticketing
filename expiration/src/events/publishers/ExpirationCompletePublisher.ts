import { ExpirationCompleteEvent, NatsPublisher, NatsStream, NatsSubject } from "@frissionapps/common";

export class ExpirationCompletePublisher extends NatsPublisher<ExpirationCompleteEvent> {
    readonly stream = NatsStream.Ticketing
    readonly subject = NatsSubject.ExpirationComplete
}