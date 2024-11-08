import { app } from "../app"
import jwt from "jsonwebtoken"

export const testSignUp = async (credentials: { email?: string; password?: string } = {}) => {
    const payload = { email: "test@test.com", password: "test123", ...credentials }

    const session = { jwt: jwt.sign(payload, process.env.JWT_KEY!) }
    const sessionBase64 = Buffer.from(JSON.stringify(session)).toString("base64")

    return [`session=${sessionBase64}`]
}
