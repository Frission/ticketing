import jwt from "jsonwebtoken"

export const testSignUp = (credentials: { email?: string, id?: string } = {}) => {
    const payload = { email: "test@test.com", id: "123", ...credentials,  }

    const session = { jwt: jwt.sign(payload, process.env.JWT_KEY!) }
    const sessionBase64 = Buffer.from(JSON.stringify(session)).toString("base64")

    return [`session=${sessionBase64}`]
}
