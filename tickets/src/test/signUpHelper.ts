import jwt from "jsonwebtoken"

export const testSignUp = (credentials: { email?: string } = {}) => {
    const payload = { email: "test@test.com", ...credentials, id: "123" }

    const session = { jwt: jwt.sign(payload, process.env.JWT_KEY!) }
    const sessionBase64 = Buffer.from(JSON.stringify(session)).toString("base64")

    return [`session=${sessionBase64}`]
}
