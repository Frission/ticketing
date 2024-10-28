import { ErrorDescription } from "./util/ErrorResponse"
import { ServerError } from "./util/ServerError"

export class DatabaseConnectionError extends ServerError {
    public readonly reason = "Error connecting to database"
    public readonly statusCode = 500

    constructor() {
        super("Error connecting to database")
        // Only because we are extending a built-in JS class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    serializeErrors(): Array<ErrorDescription> {
        return [
            {
                message: this.reason,
            },
        ]
    }
}
