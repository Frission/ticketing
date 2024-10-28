export interface ErrorResponse {
    errors: Array<ErrorDescription>
}

export interface ErrorDescription {
    message: string
    field?: string
}
