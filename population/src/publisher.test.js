const { publish, subscribe } = require('./publisher')

const MOCK_EVENT_1 = 'MOCK_EVENT_1'
const MOCK_EVENT_2 = 'MOCK_EVENT_2'

test('subscribed callback is called when event is published', () => {
    const mockCallback = jest.fn()
    subscribe(MOCK_EVENT_1, mockCallback)
    publish(MOCK_EVENT_1)
    expect(mockCallback.mock.calls.length).toBe(1)
})

test('subscribed callback gets called with payload', () => {
    const mockCallback = jest.fn()
    const mockPayload = 'PAYLOAD'
    subscribe(MOCK_EVENT_2, mockCallback)
    publish(MOCK_EVENT_2, mockPayload)
    expect(mockCallback.mock.calls[0][0]).toBe('PAYLOAD')
})
