import { ErrorDescription } from "./util/ErrorResponse"
import { ServerError } from "./util/ServerError"

export class BadRequestError extends ServerError {
    public readonly statusCode = 400

    constructor(public readonly message: string) {
        super(message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    public serializeErrors(): Array<ErrorDescription> {
        return [{ message: this.message }]
    }
}
