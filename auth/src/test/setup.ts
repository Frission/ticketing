import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"

let mongo: MongoMemoryServer

beforeAll(async () => {
    process.env.JWT_KEY = "testkey"

    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
})

beforeEach(async () => {
    const collections = (await mongoose.connection.db?.collections()) ?? []

    for (let collection of collections) {
        await collection.deleteMany()
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.disconnect()
})