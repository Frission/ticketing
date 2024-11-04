import { buildClient } from "../api/buildClient"

const LandingPage = ({ currentUser }) => {
    return (
        <div>
            <h1>Landing Page</h1>
            {currentUser ? <h3>You are signed in</h3> : <h3>You are not signed in</h3>}
        </div>
    )
}

LandingPage.getInitialProps = async (context) => {
    const response = await buildClient(context).get("/api/users/currentuser")

    return response.data
}

export default LandingPage
