import { ErrorDescription } from "./util/ErrorResponse"
import { ServerError } from "./util/ServerError"

export class NotFoundError extends ServerError {
    public readonly statusCode = 404

    constructor() {
        super("Route not found")
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    public serializeErrors(): Array<ErrorDescription> {
        return [
            {
                message: "Not Found",
            },
        ]
    }
}
