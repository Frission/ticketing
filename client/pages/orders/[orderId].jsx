import React from "react"
import StripeCheckout from "react-stripe-checkout"
import useRequest from "../../hooks/useRequest"
import { Router } from "next/router"

const OrderShow = ({ currentUser, order }) => {
    const [timeLeft, setTimeLeft] = React.useState(0)
    const [doPayment, errors] = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id,
        },
        onSuccess: () => {
            Router.push("/orders")
        },
    })

    React.useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.round(msLeft / 1000))
        }

        const timeout = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timeout)
        }
    }, [])

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }

    return (
        <div>
            Time left to pay: {msLeft / 1000} seconds
            <StripeCheckout
                token={(token) => doPayment({ token: id })}
                stripeKey="pk_test_51QSEdFH55lNFQTw904qmwKG5lZG95r1JHtgxsHcO24GzEPWQVKcbmBZaKFshsQNldf2iXdl4lqXA44EL59KBzaI500e41iYQ3L"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query
    const { data } = await client.get(`/api/orders/${orderId}`)

    return { order: data }
}

export default OrderShow
