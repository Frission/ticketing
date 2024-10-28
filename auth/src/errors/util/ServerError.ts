import { ErrorDescription } from "./ErrorResponse"

export abstract class ServerError extends Error {
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, ServerError.prototype)
    }

    public abstract readonly statusCode: number
    public abstract serializeErrors(): Array<ErrorDescription>
}
