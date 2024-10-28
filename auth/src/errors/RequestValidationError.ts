import { ValidationError } from "express-validator"
import { ErrorDescription } from "./util/ErrorResponse"
import { ServerError } from "./util/ServerError"

export class RequestValidationError extends ServerError {
    public readonly statusCode = 400
    constructor(private readonly errors: Array<ValidationError>) {
        super("Invalid request parameters")
        // Only because we are extending a built-in JS class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
    serializeErrors(): Array<ErrorDescription> {
        return this.errors.map((error) => {
            const formattedError: ErrorDescription = { message: error.msg }
            if (error.type === "field") formattedError.field = error.path
            return formattedError
        })
    }
}
