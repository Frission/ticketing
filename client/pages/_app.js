import "bootstrap/dist/css/bootstrap.css"
import { buildClient } from "../api/buildClient"
import { Header } from "../components/header"

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
    const client = buildClient(ctx)
    const { data } = await client.get("/api/users/currentuser")

    let pageProps = {}
    if (typeof Component.getInitialProps === "function") {
        pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, ...data }
}

export default AppComponent
