const natsWrapper = {
    client: {
        publish: jest.fn(),
    },
}

jest.mock("../util/NatsWrapper", () => {
    return { natsWrapper }
})

jest.mock("@frissionapps/common/build/events/NatsListener")