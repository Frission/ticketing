import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"

const natsWrapper = {
    client: {
        publish: jest.fn(),
    },
}

jest.mock("../util/NatsWrapper", () => {
    return { natsWrapper }
})

jest.mock("@frissionapps/common/build/events/NatsListener")

jest.mock("../stripe", () => {
    return {
        stripe: {
            charges: {
                create: jest.fn().mockResolvedValue({ id: "stripeid" }),
            },
        },
    }
})

jest.mock("../events/publishers/PaymentCreatedPublisher", () => {
    return {
        PaymentCreatedPublisher: jest.fn().mockImplementation(() => ({
            publish: jest.fn().mockImplementation((...args) => natsWrapper.client.publish(...args)),
        })),
    }
})

let mongo: MongoMemoryServer

beforeAll(async () => {
    jest.clearAllMocks()
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
