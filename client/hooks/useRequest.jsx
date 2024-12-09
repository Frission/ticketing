import React from "react"
import axios from "axios"

/**
 * @param {Object} config - Request config
 * @param {!string} config.url - Url to make the request to.
 * @param {!("post" | "get" | "put" | "delete")} config.method - Request method, lowercase
 * @param {?string} config.body - Parameters to send inside the body if this is a post or put request
 * @param {?() => Object} config.onSuccess - Callback to be invoked when request succeeds
 * @returns {[() => void, React.ReactElement]}
 */
export const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = React.useState(null)

    const doRequest = async (props = {}) => {
        try {
            setErrors(null)
            const response = await axios[method](url, { ...body, ...props })
            if (onSuccess) {
                onSuccess(response.data)
            }
            return response.data
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map((err) => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>,
            )
        }
    }

    return [doRequest, errors]
}
