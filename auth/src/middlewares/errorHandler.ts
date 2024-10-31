import { ErrorRequestHandler } from "express"
import { ErrorResponse } from "../errors/util/ErrorResponse"
import { ServerError } from "../errors/util/ServerError"

export const errorHandler: ErrorRequestHandler = (err: Partial<Error>, req, res, next) => {
    if (err instanceof ServerError) {
        res.status(err.statusCode).send({ errors: err.serializeErrors() })
        return
    }

    res.status(500).send({
        errors: [{ message: err?.message ?? "Something went wrong" }],
    } satisfies ErrorResponse)
}
