import request from "supertest"
import { app } from "../app"

export const testSignUp = async (credentials: { email?: string; password?: string } = {}) => {
    const signUpCredentials = { email: "test@test.com", password: "test123", ...credentials }
    const response = await request(app).post("/api/users/signup").send(signUpCredentials).expect(201)

    const cookie = response.get("Set-Cookie")

    expect(cookie).toBeTruthy()

    return response
}
