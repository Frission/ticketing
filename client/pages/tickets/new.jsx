import React from "react"
import useRequest from "../../hooks/useRequest"
import Router from "next/router"

const NewTicket = () => {
    const [title, setTitle] = React.useState("")
    const [price, setPrice] = React.useState("")
    const [createTicket, errors] = useRequest({
        url: "/api/tickets",
        method: "post",
        body: { title, price },
        onSuccess: () => {
            Router.push("/")
        },
    })

    const onBlur = (e) => {
        const value = parseFloat(price)

        if (isNaN(value) || value == null || value < 0) {
            return
        } else {
            setPrice(value.toFixed(2))
        }
    }

    const onSubmit = (event) => {
        event.preventDefault()
        createTicket()
    }

    return (
        <div>
            <h1>Create Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title-input">Title</label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        id="title-input"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price-input">Price</label>
                    <input
                        onChange={(e) => setPrice(e.target.value)}
                        onBlur={onBlur}
                        type="number"
                        id="price-input"
                        className="form-control"
                    />
                </div>
                {errors}
                <button className="btn btn-primary" type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default NewTicket
