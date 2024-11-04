import React from "react"
import { useRequest } from "../../hooks/useRequest"
import Router from "next/router"

const SignOutPage = () => {
    const [signOut] = useRequest({
        url: "/api/users/signout",
        method: "get",
        body: {},
        onSuccess: () => {
            Router.push("/")
        },
    })

    React.useEffect(() => {
        signOut()
    }, [])

    return <div>Signing you out...</div>
}

export default SignOutPage
