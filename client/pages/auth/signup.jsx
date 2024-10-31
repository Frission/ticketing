import React from "react"
import { useRequest } from "../../hooks/useRequest"
import Router from "next/router"

const SignupPage = () => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [signUp, errors] = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: { email, password },
        onSuccess: () => {
            Router.push("/")
        },
    })

    const onSubmit = async (e) => {
        e.preventDefault()
        signUp()
    }

    return (
        <div className="container d-flex flex-column align-items-center">
            <form className="col-6 d-flex flex-column gap-3 mt-4" onSubmit={onSubmit}>
                <h1>Sign Up</h1>
                <div className="form-group">
                    <label htmlFor="email-input" className="form-label">
                        E-mail Address
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email-input"
                        type="text"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password-input" className="form-label">
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password-input"
                        type="password"
                        className="form-control"
                    />
                </div>
                {errors}
                <button className="btn btn-primary mt-3" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignupPage
