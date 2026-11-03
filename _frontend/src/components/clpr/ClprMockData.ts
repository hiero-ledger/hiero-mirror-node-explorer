// SPDX-License-Identifier: Apache-2.0

// Static mockup data for the CLPR pages, shaped like the mirror node REST API responses
// (GET /api/v1/clpr/channels, GET /api/v1/clpr/channels/{channelId}/messages).
// To be replaced by real API calls once the endpoints are available.

import {
    ClprChannelMock,
    ClprConnectorMock,
    ClprMessage,
    ClprMessageReplyStatus,
    ClprMessageType
} from "@/schemas/MirrorNodeSchemas.ts";

const hex = (prefix: string): string => "0x" + prefix.padEnd(64, "0")
const address = (prefix: string): string => "0x" + prefix.padEnd(40, "0")

const CHANNEL_1A2B = hex("1a2b3c4d")
const CHANNEL_2F91 = hex("2f918e02")
const CHANNEL_5B60 = hex("5b60a1c7")

const CONNECTOR_4D5E = hex("4d5e6f70")
const CONNECTOR_88AA = hex("88aa22bb")
const CONNECTOR_55CC = hex("55cc9d41")
const CONNECTOR_77EE = hex("77ee0b36")
const CONNECTOR_3344 = hex("33447788")

const APP_A1 = address("a1")
const APP_A2 = address("a2")
const APP_A3 = address("a3")
const APP_A4 = address("a4")
const APP_T1 = address("7788aa11bb22cc33dd44ee55ff66778899001a1a")
const APP_T2 = address("9a1b2c3d4e5f60718293a4b5c6d7e8f901020304")
const APP_T3 = address("1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f70819203")

export const CLPR_MOCK_CHANNELS: ClprChannelMock[] = [
    {channel_id: CHANNEL_1A2B, chain_id: "eip155:1"},
    {channel_id: CHANNEL_2F91, chain_id: "eip155:1"},
    {channel_id: CHANNEL_5B60, chain_id: "eip155:137"},
]

const PAYLOADS = [
    "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000016345785d8a0000",
    "0x095ea7b30000000000000000000000007788aa11bb22cc33dd44ee55ff66778899001a1a0000000000000000000000000000000000000000000000000de0b6b3a7640000",
    "0x40c10f19000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000",
    "0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045",
]

const HANDWRITTEN_MESSAGES: ClprMessage[] = [
    {
        acknowledged: false,
        channel_id: CHANNEL_1A2B,
        connector_id: null,
        message_data: "0x0a0b436f6e666967557064617465100318c0f1ed01",
        message_id: 1245,
        reply_status: null,
        reply_to_message_id: null,
        running_hash: hex("1a2b04dd"),
        sender: null,
        target_application: null,
        timestamp: "1791016200.000000001",
        type: ClprMessageType.CONTROL,
    },
    {
        acknowledged: false,
        channel_id: CHANNEL_1A2B,
        connector_id: CONNECTOR_4D5E,
        message_data: "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000016345785d8a0000",
        message_id: 1244,
        reply_status: null,
        reply_to_message_id: null,
        running_hash: hex("1a2b04dc"),
        sender: APP_A1,
        target_application: APP_T1,
        timestamp: "1790929860.000000300",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: true,
        channel_id: CHANNEL_1A2B,
        connector_id: null,
        message_data: "0x01",
        message_id: 1243,
        reply_status: ClprMessageReplyStatus.SUCCESS,
        reply_to_message_id: 997,
        running_hash: hex("1a2b04db"),
        sender: null,
        target_application: null,
        timestamp: "1790929800.000000301",
        type: ClprMessageType.RESPONSE,
    },
    {
        acknowledged: true,
        channel_id: CHANNEL_1A2B,
        connector_id: CONNECTOR_4D5E,
        message_data: "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000016345785d8a0000",
        message_id: 1240,
        reply_status: ClprMessageReplyStatus.SUCCESS,
        reply_to_message_id: null,
        running_hash: hex("1a2b04d8"),
        sender: APP_A1,
        target_application: APP_T1,
        timestamp: "1790842920.000000302",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: true,
        channel_id: CHANNEL_1A2B,
        connector_id: CONNECTOR_88AA,
        message_data: "0x40c10f19000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000",
        message_id: 1238,
        reply_status: ClprMessageReplyStatus.APPLICATION_ERROR,
        reply_to_message_id: null,
        running_hash: hex("1a2b04d6"),
        sender: APP_A2,
        target_application: APP_T1,
        timestamp: "1790841480.000000303",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: true,
        channel_id: CHANNEL_1A2B,
        connector_id: CONNECTOR_88AA,
        message_data: "0x095ea7b30000000000000000000000007788aa11bb22cc33dd44ee55ff66778899001a1a0000000000000000000000000000000000000000000000000de0b6b3a7640000",
        message_id: 1237,
        reply_status: ClprMessageReplyStatus.CONNECTOR_UNDERFUNDED,
        reply_to_message_id: null,
        running_hash: hex("1a2b04d5"),
        sender: APP_A2,
        target_application: APP_T1,
        timestamp: "1790838600.000000304",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: false,
        channel_id: CHANNEL_2F91,
        connector_id: CONNECTOR_55CC,
        message_data: "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000016345785d8a0000",
        message_id: 512,
        reply_status: null,
        reply_to_message_id: null,
        running_hash: hex("2f910200"),
        sender: APP_A3,
        target_application: APP_T2,
        timestamp: "1790824140.000000310",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: true,
        channel_id: CHANNEL_2F91,
        connector_id: CONNECTOR_55CC,
        message_data: "0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045",
        message_id: 511,
        reply_status: ClprMessageReplyStatus.CONNECTOR_NOT_FOUND,
        reply_to_message_id: null,
        running_hash: hex("2f9101ff"),
        sender: APP_A3,
        target_application: APP_T2,
        timestamp: "1790805600.000000311",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: true,
        channel_id: CHANNEL_5B60,
        connector_id: CONNECTOR_77EE,
        message_data: "0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045",
        message_id: 8819,
        reply_status: null,
        reply_to_message_id: null,
        running_hash: hex("5b602273"),
        sender: APP_A4,
        target_application: APP_T3,
        timestamp: "1791013200.000000330",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: true,
        channel_id: CHANNEL_5B60,
        connector_id: CONNECTOR_3344,
        message_data: "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000016345785d8a0000",
        message_id: 8812,
        reply_status: ClprMessageReplyStatus.SUCCESS,
        reply_to_message_id: null,
        running_hash: hex("5b60226c"),
        sender: APP_A4,
        target_application: APP_T3,
        timestamp: "1790919600.000000331",
        type: ClprMessageType.DATA,
    },
]

// Older messages of the first channel, so that the pagination can be exercised
const GENERATED_MESSAGES: ClprMessage[] = Array.from({length: 40}, (_, i): ClprMessage => {
    const isResponse = i % 4 === 3
    return {
        acknowledged: true,
        channel_id: CHANNEL_1A2B,
        connector_id: isResponse ? null : (i % 3 === 1 ? CONNECTOR_88AA : CONNECTOR_4D5E),
        message_data: isResponse ? "0x01" : PAYLOADS[i % PAYLOADS.length],
        message_id: 1236 - i,
        reply_status: isResponse ? ClprMessageReplyStatus.SUCCESS : (i % 5 === 0 ? ClprMessageReplyStatus.SUCCESS : null),
        reply_to_message_id: isResponse ? 990 - i : null,
        running_hash: hex("1a2b" + (1236 - i).toString(16)),
        sender: isResponse ? null : APP_A1,
        target_application: isResponse ? null : APP_T1,
        timestamp: (1759219200 - i * 3600) + "." + String(400 + i).padStart(9, "0"),
        type: isResponse ? ClprMessageType.RESPONSE : ClprMessageType.DATA,
    }
})

export const CLPR_MOCK_CONNECTORS: ClprConnectorMock[] = [
    {connector_id: CONNECTOR_4D5E, channel_id: CHANNEL_1A2B},
    {connector_id: CONNECTOR_88AA, channel_id: CHANNEL_1A2B},
    {connector_id: CONNECTOR_55CC, channel_id: CHANNEL_2F91},
    {connector_id: CONNECTOR_77EE, channel_id: CHANNEL_5B60},
    {connector_id: CONNECTOR_3344, channel_id: CHANNEL_5B60},
]

export function getClprMockConnectors(channelId: string): ClprConnectorMock[] {
    return CLPR_MOCK_CONNECTORS.filter(c => c.channel_id === channelId)
}

export const CLPR_MOCK_MESSAGES: ClprMessage[] = [...HANDWRITTEN_MESSAGES, ...GENERATED_MESSAGES]

export function getClprMockMessages(channelId: string, type: ClprMessageType | null = null, connectorId: string | null = null): ClprMessage[] {
    // Mimics the API default order: consensus timestamp descending, then message id descending
    return CLPR_MOCK_MESSAGES
        .filter(m => m.channel_id === channelId && (type === null || m.type === type) && (connectorId === null || m.connector_id === connectorId))
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp) || b.message_id - a.message_id)
}

export function getClprMockMessage(channelId: string, messageId: number): ClprMessage | null {
    return CLPR_MOCK_MESSAGES.find(m => m.channel_id === channelId && m.message_id === messageId) ?? null
}

const NULL_HASH = "0x" + "0".repeat(64)

// The running hash of the previous message of the same channel (the hash chain input of the given message)
export function getClprMockPreviousRunningHash(message: ClprMessage): string {
    const previous = CLPR_MOCK_MESSAGES
        .filter(m => m.channel_id === message.channel_id && m.message_id < message.message_id)
        .sort((a, b) => b.message_id - a.message_id)[0]
    return previous?.running_hash ?? NULL_HASH
}
