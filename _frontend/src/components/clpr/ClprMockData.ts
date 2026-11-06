// SPDX-License-Identifier: Apache-2.0

// Static mockup data for the CLPR pages, shaped like the mirror node REST API responses
// (GET /api/v1/clpr/channels, GET /api/v1/clpr/channels/{channelId}/messages).
// To be replaced by real API calls once the endpoints are available.

import {
    ClprChannel,
    ClprChannelStatus,
    ClprConnector,
    ClprCurrentEndpointManifest,
    ClprLedgerConfiguration,
    ClprMessage,
    ClprMessageReplyStatus,
    ClprMessageType,
    ClprPendingConnector,
    KeyType
} from "@/schemas/MirrorNodeSchemas.ts";

const hex = (prefix: string): string => "0x" + prefix.padEnd(64, "0")
// 32-byte id displayed as 0xPREFIX…SUFFIX in the HTML mockup
const hexId = (prefix: string, suffix: string): string => "0x" + prefix + "0".repeat(64 - prefix.length - suffix.length) + suffix
const address = (prefix: string): string => "0x" + prefix.padEnd(40, "0")

const CHANNEL_1A2B = hexId("1a2b", "3c4d")
const CHANNEL_2F91 = hexId("2f91", "8e02")
const CHANNEL_5B60 = hexId("5b60", "9f3e")
const CHANNEL_3D82 = hexId("3d82", "c701")
const CHANNEL_AB33 = hexId("ab33", "7760")

const CONNECTOR_4D5E = hexId("4d5e", "6f70")
const CONNECTOR_88AA = hexId("88aa", "22bb")
const CONNECTOR_55CC = hexId("55cc", "99dd")
const CONNECTOR_77EE = hexId("77ee", "33ff")
const CONNECTOR_3344 = hexId("3344", "7788")
const CONNECTOR_9900 = hexId("9900", "aabb")
const CONNECTOR_6655 = hexId("6655", "4433")

const APP_A1 = address("a1")
const APP_A2 = address("a2")
const APP_A3 = address("a3")
const APP_A4 = address("a4")
const APP_T1 = address("7788aa11bb22cc33dd44ee55ff66778899001a1a")
const APP_T2 = address("9a1b2c3d4e5f60718293a4b5c6d7e8f901020304")
const APP_T3 = address("1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f70819203")

// Channels as returned by GET /api/v1/clpr/channels, newest first within each status group.
// PENDING channels are commitments not yet completed: they have no channel_id nor chain_id.
export const CLPR_MOCK_CHANNELS: ClprChannel[] = [
    {
        acked_message_id: 1240,
        chain_id: "eip155:1",
        channel_id: hexId("1a2b", "3c4d"),
        created_timestamp: "1789913100.000000000",
        endpoint_manifest_version: 4,
        next_message_id: 1245,
        ownership_commitment: hexId("1a2b", "c0de"),
        received_message_id: 998,
        status: ClprChannelStatus.ACTIVE,
        timestamp: {from: "1790583300.000000000", to: null},
        verifier_contract_id: null,
        verifier_fingerprint: hexId("9f8e", "7a61"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.1", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.2", port: 8443}}],
            version: 4,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1790583300.000000000",
        peer_throttles: {
            max_gas_per_message: 3000000,
            max_local_endpoints: null,
            max_message_payload_bytes: 32768,
            max_messages_per_bundle: 500,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("3b77", "c1d9"),
        sent_running_hash: hexId("6f1a", "e02c"),
        trust_anchor: "0x" + "77aabbcc" + "ab".repeat(60),
        trust_anchor_id: hexId("77aa", "bbcc"),
    },
    {
        acked_message_id: 498,
        chain_id: "eip155:1",
        channel_id: hexId("2f91", "8e02"),
        created_timestamp: "1790070000.000000000",
        endpoint_manifest_version: 2,
        next_message_id: 513,
        ownership_commitment: hexId("2f91", "c0de"),
        received_message_id: 480,
        status: ClprChannelStatus.PAUSED,
        timestamp: {from: "1790824320.000000000", to: null},
        verifier_contract_id: "0.0.555001",
        verifier_fingerprint: hexId("6601", "aa90"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.3", port: 8443}}],
            version: 2,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1790070000.000000000",
        peer_throttles: {
            max_gas_per_message: 1000000,
            max_local_endpoints: null,
            max_message_payload_bytes: 16384,
            max_messages_per_bundle: 200,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("9d02", "4410"),
        sent_running_hash: hexId("3a71", "88e0"),
        trust_anchor: "0x" + "0c0cd0d0" + "ab".repeat(60),
        trust_anchor_id: hexId("0c0c", "d0d0"),
    },
    {
        acked_message_id: 2206,
        chain_id: "eip155:1",
        channel_id: hexId("7cd4", "11aa"),
        created_timestamp: "1786705200.000000000",
        endpoint_manifest_version: 4,
        next_message_id: 2210,
        ownership_commitment: hexId("7cd4", "c0de"),
        received_message_id: 2190,
        status: ClprChannelStatus.CLOSING,
        timestamp: {from: "1790920800.000000000", to: null},
        verifier_contract_id: null,
        verifier_fingerprint: hexId("9f8e", "7a61"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.4", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.5", port: 8443}}],
            version: 4,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1790971200.000000000",
        peer_throttles: {
            max_gas_per_message: 3000000,
            max_local_endpoints: null,
            max_message_payload_bytes: 32768,
            max_messages_per_bundle: 500,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("a0a0", "1b1b"),
        sent_running_hash: hexId("185f", "66be"),
        trust_anchor: "0x" + "77aabbcc" + "ab".repeat(60),
        trust_anchor_id: hexId("77aa", "bbcc"),
    },
    {
        acked_message_id: 8815,
        chain_id: "eip155:137",
        channel_id: hexId("5b60", "9f3e"),
        created_timestamp: "1783009500.000000000",
        endpoint_manifest_version: 6,
        next_message_id: 8820,
        ownership_commitment: hexId("5b60", "c0de"),
        received_message_id: 8790,
        status: ClprChannelStatus.ACTIVE,
        timestamp: {from: "1783009500.000000000", to: null},
        verifier_contract_id: null,
        verifier_fingerprint: hexId("2211", "ff00"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.6", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.7", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.8", port: 8443}}],
            version: 6,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1789470000.000000000",
        peer_throttles: {
            max_gas_per_message: 8000000,
            max_local_endpoints: null,
            max_message_payload_bytes: 65536,
            max_messages_per_bundle: 1000,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("c4c4", "2e2e"),
        sent_running_hash: hexId("074e", "55ad"),
        trust_anchor: "0x" + "5a5a6b6b" + "ab".repeat(60),
        trust_anchor_id: hexId("5a5a", "6b6b"),
    },
    {
        acked_message_id: 43,
        chain_id: "hedera:testnet",
        channel_id: hexId("3d82", "c701"),
        created_timestamp: "1790769900.000000000",
        endpoint_manifest_version: 7,
        next_message_id: 45,
        ownership_commitment: hexId("3d82", "c0de"),
        received_message_id: 40,
        status: ClprChannelStatus.ACTIVE,
        timestamp: {from: "1790769900.000000000", to: null},
        verifier_contract_id: null,
        verifier_fingerprint: hexId("1010", "2020"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.9", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.10", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.11", port: 8443}}],
            version: 7,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1790769900.000000000",
        peer_throttles: {
            max_gas_per_message: 15000000,
            max_local_endpoints: null,
            max_message_payload_bytes: 65536,
            max_messages_per_bundle: 1000,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("7e7e", "9f9f"),
        sent_running_hash: hexId("e52c", "33ab"),
        trust_anchor: "0x" + "40405050" + "ab".repeat(60),
        trust_anchor_id: hexId("4040", "5050"),
    },
    {
        acked_message_id: 309,
        chain_id: "hedera:testnet",
        channel_id: hexId("9e14", "4420"),
        created_timestamp: "1781078400.000000000",
        endpoint_manifest_version: 7,
        next_message_id: 310,
        ownership_commitment: hexId("9e14", "c0de"),
        received_message_id: 305,
        status: ClprChannelStatus.DRAINED,
        timestamp: {from: "1790553600.000000000", to: null},
        verifier_contract_id: null,
        verifier_fingerprint: hexId("1010", "2020"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.12", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.13", port: 8443}}, {service_endpoint: {ip_address: "203.0.113.14", port: 8443}}],
            version: 7,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1789516800.000000000",
        peer_throttles: {
            max_gas_per_message: 15000000,
            max_local_endpoints: null,
            max_message_payload_bytes: 65536,
            max_messages_per_bundle: 1000,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("1c1c", "8d8d"),
        sent_running_hash: hexId("d41b", "22fa"),
        trust_anchor: "0x" + "40405050" + "ab".repeat(60),
        trust_anchor_id: hexId("4040", "5050"),
    },
    {
        acked_message_id: 58,
        chain_id: "cosmos:cosmoshub-4",
        channel_id: hexId("ab33", "7760"),
        created_timestamp: "1789761000.000000000",
        endpoint_manifest_version: 1,
        next_message_id: 61,
        ownership_commitment: hexId("ab33", "c0de"),
        received_message_id: 50,
        status: ClprChannelStatus.ACTIVE,
        timestamp: {from: "1789761000.000000000", to: null},
        verifier_contract_id: "0.0.555002",
        verifier_fingerprint: hexId("3344", "5566"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.15", port: 8443}}],
            version: 1,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1789761000.000000000",
        peer_throttles: {
            max_gas_per_message: 500000,
            max_local_endpoints: null,
            max_message_payload_bytes: 8192,
            max_messages_per_bundle: 100,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("5a5a", "e0e0"),
        sent_running_hash: hexId("c30a", "11f9"),
        trust_anchor: "0x" + "77889900" + "ab".repeat(60),
        trust_anchor_id: hexId("7788", "9900"),
    },
    {
        acked_message_id: 1401,
        chain_id: "sei:pacific-1",
        channel_id: hexId("f002", "d8e1"),
        created_timestamp: "1777593600.000000000",
        endpoint_manifest_version: 3,
        next_message_id: 1402,
        ownership_commitment: hexId("f002", "c0de"),
        received_message_id: 1400,
        status: ClprChannelStatus.CLOSED,
        timestamp: {from: "1786752000.000000000", to: null},
        verifier_contract_id: null,
        verifier_fingerprint: hexId("aabb", "ccdd"),
        endpoint_manifest: {
            endpoints: [{service_endpoint: {ip_address: "203.0.113.16", port: 8443}}],
            version: 3,
        },
        last_config_timestamp: "1757930400.000000000",
        peer_config_timestamp: "1785578400.000000000",
        peer_throttles: {
            max_gas_per_message: 2000000,
            max_local_endpoints: null,
            max_message_payload_bytes: 16384,
            max_messages_per_bundle: 300,
            max_peer_endpoints: null,
            max_queue_depth: null,
            max_sync_bytes: null,
        },
        received_running_hash: hexId("6060", "7a7a"),
        sent_running_hash: hexId("b219", "00e8"),
        trust_anchor: "0x" + "eeff0011" + "ab".repeat(60),
        trust_anchor_id: hexId("eeff", "0011"),
    },
    {
        acked_message_id: null,
        chain_id: null,
        channel_id: null,
        created_timestamp: "1790926800.000000000",
        endpoint_manifest_version: null,
        next_message_id: null,
        ownership_commitment: hexId("cc44", "8801"),
        received_message_id: null,
        status: ClprChannelStatus.PENDING,
        timestamp: null,
        verifier_contract_id: null,
        verifier_fingerprint: null,
        endpoint_manifest: null,
        last_config_timestamp: null,
        peer_config_timestamp: null,
        peer_throttles: null,
        received_running_hash: null,
        sent_running_hash: null,
        trust_anchor: null,
        trust_anchor_id: null,
    },
    {
        acked_message_id: null,
        chain_id: null,
        channel_id: null,
        created_timestamp: "1790845920.000000000",
        endpoint_manifest_version: null,
        next_message_id: null,
        ownership_commitment: hexId("7ab3", "f1e2"),
        received_message_id: null,
        status: ClprChannelStatus.PENDING,
        timestamp: null,
        verifier_contract_id: null,
        verifier_fingerprint: null,
        endpoint_manifest: null,
        last_config_timestamp: null,
        peer_config_timestamp: null,
        peer_throttles: null,
        received_running_hash: null,
        sent_running_hash: null,
        trust_anchor: null,
        trust_anchor_id: null,
    },
    {
        acked_message_id: null,
        chain_id: null,
        channel_id: null,
        created_timestamp: "1790719500.000000000",
        endpoint_manifest_version: null,
        next_message_id: null,
        ownership_commitment: hexId("1199", "55aa"),
        received_message_id: null,
        status: ClprChannelStatus.PENDING,
        timestamp: null,
        verifier_contract_id: null,
        verifier_fingerprint: null,
        endpoint_manifest: null,
        last_config_timestamp: null,
        peer_config_timestamp: null,
        peer_throttles: null,
        received_running_hash: null,
        sent_running_hash: null,
        trust_anchor: null,
        trust_anchor_id: null,
    },
]

// Channels having an id, i.e. all but the pending ones
export const CLPR_MOCK_COMPLETED_CHANNELS: ClprChannel[] = CLPR_MOCK_CHANNELS.filter(c => c.channel_id !== null)

export function getClprMockChannels(status: ClprChannelStatus | null = null): ClprChannel[] {
    return CLPR_MOCK_CHANNELS
        .filter(c => status === null ? true : c.status === status)
        .sort((a, b) => Number(b.created_timestamp) - Number(a.created_timestamp))
}

const PAYLOADS = [
    "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000016345785d8a0000",
    "0x095ea7b30000000000000000000000007788aa11bb22cc33dd44ee55ff66778899001a1a0000000000000000000000000000000000000000000000000de0b6b3a7640000",
    "0x40c10f19000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000",
    "0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045",
]

const HANDWRITTEN_MESSAGES: ClprMessage[] = [
    {
        acknowledged: false,
        channel_id: CHANNEL_3D82,
        connector_id: CONNECTOR_9900,
        message_data: PAYLOADS[0],
        message_id: 44,
        reply_status: null,
        reply_to_message_id: null,
        running_hash: hex("3d82002c"),
        sender: APP_A4,
        target_application: APP_T3,
        timestamp: "1790979000.000000000",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: false,
        channel_id: CHANNEL_AB33,
        connector_id: CONNECTOR_6655,
        message_data: PAYLOADS[3],
        message_id: 59,
        reply_status: null,
        reply_to_message_id: null,
        running_hash: hex("ab33003b"),
        sender: APP_A4,
        target_application: APP_T3,
        timestamp: "1790964000.000000000",
        type: ClprMessageType.DATA,
    },
    {
        acknowledged: false,
        channel_id: CHANNEL_AB33,
        connector_id: CONNECTOR_6655,
        message_data: PAYLOADS[0],
        message_id: 60,
        reply_status: null,
        reply_to_message_id: null,
        running_hash: hex("ab33003c"),
        sender: APP_A4,
        target_application: APP_T3,
        timestamp: "1790969400.000000000",
        type: ClprMessageType.DATA,
    },
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
        timestamp: "1791016200.000000000",
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
        timestamp: "1791016260.000000000",
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
        timestamp: "1791016200.000000000",
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
        timestamp: "1790842920.000000000",
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
        timestamp: "1790841480.000000000",
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
        timestamp: "1790838600.000000000",
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
        timestamp: "1790824140.000000000",
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
        timestamp: "1790805600.000000000",
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
        timestamp: "1791013200.000000000",
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
        timestamp: "1790919600.000000000",
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
        timestamp: (1759219200 - i * 3600) + ".000000000",
        type: isResponse ? ClprMessageType.RESPONSE : ClprMessageType.DATA,
    }
})

// Connectors as returned by GET /api/v1/clpr/channels/{channelId}/connectors (stake in tinybars)
export const CLPR_MOCK_CONNECTORS: ClprConnector[] = [
    {
        admin_key: {_type: KeyType.ED25519, key: "302a300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: CHANNEL_1A2B,
        connector_contract_id: "0.0.789",
        connector_id: CONNECTOR_4D5E,
        created_timestamp: "1789917600.000000000",
        deleted: false,
        in_flight_message_count: 2,
        locked_stake: "100000000",
        slash_count: 0,
        stake_recipient_id: null,
        timestamp: {from: "1789917600.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "302a300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: CHANNEL_1A2B,
        connector_contract_id: "0.0.790",
        connector_id: CONNECTOR_88AA,
        created_timestamp: "1789034400.000000000",
        deleted: false,
        in_flight_message_count: 0,
        locked_stake: "20000000",
        slash_count: 4,
        stake_recipient_id: null,
        timestamp: {from: "1789034400.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "302b300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: CHANNEL_2F91,
        connector_contract_id: "0.0.791",
        connector_id: CONNECTOR_55CC,
        created_timestamp: "1790070300.000000000",
        deleted: false,
        in_flight_message_count: 1,
        locked_stake: "200000000",
        slash_count: 1,
        stake_recipient_id: null,
        timestamp: {from: "1790070300.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "302c300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: hexId("7cd4", "11aa"),
        connector_contract_id: "0.0.792",
        connector_id: hexId("1234", "abcd"),
        created_timestamp: "1786705500.000000000",
        deleted: false,
        in_flight_message_count: 0,
        locked_stake: "100000000",
        slash_count: 0,
        stake_recipient_id: null,
        timestamp: {from: "1786705500.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "302d300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: CHANNEL_5B60,
        connector_contract_id: "0.0.793",
        connector_id: CONNECTOR_77EE,
        created_timestamp: "1783009800.000000000",
        deleted: false,
        in_flight_message_count: 6,
        locked_stake: "500000000",
        slash_count: 0,
        stake_recipient_id: null,
        timestamp: {from: "1783009800.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "3032300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: CHANNEL_5B60,
        connector_contract_id: "0.0.798",
        connector_id: CONNECTOR_3344,
        created_timestamp: "1783641600.000000000",
        deleted: true,
        in_flight_message_count: 0,
        locked_stake: "0",
        slash_count: 5,
        stake_recipient_id: null,
        timestamp: {from: "1783641600.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "302e300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: hexId("3d82", "c701"),
        connector_contract_id: "0.0.794",
        connector_id: hexId("9900", "aabb"),
        created_timestamp: "1790770200.000000000",
        deleted: false,
        in_flight_message_count: 0,
        locked_stake: "100000000",
        slash_count: 0,
        stake_recipient_id: null,
        timestamp: {from: "1790770200.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "302f300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: hexId("9e14", "4420"),
        connector_contract_id: "0.0.795",
        connector_id: hexId("4411", "9922"),
        created_timestamp: "1781078700.000000000",
        deleted: false,
        in_flight_message_count: 0,
        locked_stake: "50000000",
        slash_count: 2,
        stake_recipient_id: null,
        timestamp: {from: "1781078700.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "3030300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: hexId("ab33", "7760"),
        connector_contract_id: "0.0.796",
        connector_id: hexId("6655", "4433"),
        created_timestamp: "1789761300.000000000",
        deleted: false,
        in_flight_message_count: 3,
        locked_stake: "150000000",
        slash_count: 0,
        stake_recipient_id: null,
        timestamp: {from: "1789761300.000000000", to: null},
    },
    {
        admin_key: {_type: KeyType.ED25519, key: "3031300506032b6570032100" + "e5b2".repeat(16)},
        channel_id: hexId("f002", "d8e1"),
        connector_contract_id: "0.0.797",
        connector_id: hexId("2200", "ee11"),
        created_timestamp: "1777593900.000000000",
        deleted: true,
        in_flight_message_count: 0,
        locked_stake: "0",
        slash_count: 0,
        stake_recipient_id: null,
        timestamp: {from: "1777593900.000000000", to: null},
    },
]

export function getClprMockConnectors(channelId: string): ClprConnector[] {
    return CLPR_MOCK_CONNECTORS
        .filter(c => c.channel_id === channelId)
        .sort((a, b) => Number(b.created_timestamp) - Number(a.created_timestamp))
}

// "acknowledged" is computed by the API: message_id <= acked_message_id of the channel
const ackedMessageId = (channelId: string): number =>
    CLPR_MOCK_CHANNELS.find(c => c.channel_id === channelId)?.acked_message_id ?? 0

export const CLPR_MOCK_MESSAGES: ClprMessage[] = [...HANDWRITTEN_MESSAGES, ...GENERATED_MESSAGES]
    .map(m => ({...m, acknowledged: m.message_id <= ackedMessageId(m.channel_id)}))

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

export function getClprMockChannel(channelId: string): ClprChannel | null {
    return CLPR_MOCK_CHANNELS.find(c => c.channel_id === channelId) ?? null
}

// Pending connector commitments as returned by GET /api/v1/clpr/connectors/pending, newest first.
// Neither the channel nor the connector id is known until the commitment is revealed.
export const CLPR_MOCK_PENDING_CONNECTORS: ClprPendingConnector[] = [
    {commitment: hexId("0a0a", "b1b1"), created_timestamp: "1790965200.000000000", status: "OPEN"},
    {commitment: hexId("9f9f", "e2e2"), created_timestamp: "1790766000.000000000", status: "OPEN"},
]

export function getClprMockConnector(channelId: string, connectorId: string): ClprConnector | null {
    return CLPR_MOCK_CONNECTORS.find(c => c.channel_id === channelId && c.connector_id === connectorId) ?? null
}

// Current ledger configuration as returned by GET /api/v1/clpr/configuration
export const CLPR_MOCK_LEDGER_CONFIGURATION: ClprLedgerConfiguration = {
    chain_id: "hedera:mainnet",
    consensus_timestamp: "1789466400.000000000",
    initial_trust_anchor: hexId("3344", "5566"),
    initial_trust_anchor_id: hexId("9f8e", "7a61"),
    protocol_version: 1,
    service_address: "0x" + "0".repeat(37) + "16d",
    throttles: {
        max_gas_per_message: 15000000,
        max_local_endpoints: 39,
        max_message_payload_bytes: 65536,
        max_messages_per_bundle: 1000,
        max_peer_endpoints: 39,
        max_queue_depth: 10000,
        max_sync_bytes: 4194304,
    },
}

// Current endpoint manifest as returned by GET /api/v1/clpr/endpoint-manifest
export const CLPR_MOCK_ENDPOINT_MANIFEST: ClprCurrentEndpointManifest = {
    consensus_timestamp: "1790640000.000000000",
    endpoints: [
        {service_endpoint: {ip_address: "34.82.11.4", port: 50212}},
        {service_endpoint: {ip_address: "35.190.22.9", port: 50212}},
        {service_endpoint: {ip_address: "34.70.88.3", port: 50212}},
        {service_endpoint: {ip_address: "52.14.88.201", port: 50212}},
    ],
    service_address: "0x" + "0".repeat(37) + "16d",
    version: 7,
}

// The "present" of the mock data: the one of the HTML mockup (2026-10-03 09:00 UTC).
// To be replaced by the actual current time once real data is displayed.
export const CLPR_MOCK_NOW_SECONDS = Date.UTC(2026, 9, 3, 9, 0, 0) / 1000

// Timestamp of the oldest message of the channel not yet acknowledged by the peer, if any.
// With the API: GET /api/v1/clpr/channels/{channelId}/messages?order=desc&limit={backlog}&timestamp=lte:{now}
// (plus a lower bound within the allowed range): the last message returned is the oldest unacknowledged one.
export function getClprMockOldestUnackedTimestamp(channel: ClprChannel): string | null {
    const unacked = CLPR_MOCK_MESSAGES
        .filter(m => m.channel_id === channel.channel_id && m.message_id > (channel.acked_message_id ?? 0))
        .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
    return unacked.length ? unacked[0].timestamp : null
}
