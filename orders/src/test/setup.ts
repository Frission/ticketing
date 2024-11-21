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

// jest.mock("../events/publishers/OrderCreatedPublisher", () => {
//     return {
//         OrderCreatedPublisher: jest.fn().mockImplementation(() => ({
//             publish: jest.fn().mockImplementation(() => natsWrapper.client.publish()),
//         })),
//     }
// })

// jest.mock("../events/publishers/OrderUpdatedPublisher", () => {
//     return {
//         OrderUpdatedPublisher: jest.fn().mockImplementation(() => ({
//             publish: jest.fn().mockImplementation(() => natsWrapper.client.publish()),
//         })),
//     }
// })

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
