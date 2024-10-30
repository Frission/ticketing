import { ErrorDescription } from "./util/ErrorResponse"
import { ServerError } from "./util/ServerError"

export class NotAuthorizedError extends ServerError {
    public readonly statusCode = 401

    constructor() {
        super("User not authorized")
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    public serializeErrors(): Array<ErrorDescription> {
        return [
            {
                message: "You are not authorized to request this content.",
            },
        ]
    }
}
