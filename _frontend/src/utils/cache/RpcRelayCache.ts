// SPDX-License-Identifier: Apache-2.0

import {KeyType, RegisteredNode, RegisteredNodeType} from "@/schemas/MirrorNodeSchemas";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";

export class RpcRelayCache extends RegisteredNodeCache {

    public static readonly instance = new RpcRelayCache(RegisteredNodeType.RPC_RELAY)

    //
    // RegisteredNodeCache
    //

    // eslint-disable-next-line max-lines-per-function
    protected getMock(): RegisteredNode[] {

        return [
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "First Sample RPC Relay",
                registered_node_id: 10,
                service_endpoints: [
                    {
                        block_node: null,
                        domain_name: "relay1.alpha.com",
                        general_service: null,
                        ip_address: "192.168.12.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.RPC_RELAY
                    },
                    {
                        block_node: null,
                        domain_name: null,
                        general_service: null,
                        ip_address: "192.168.42.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: false,
                        rpc_relay: null,
                        type: RegisteredNodeType.RPC_RELAY
                    },
                    {
                        block_node: null,
                        domain_name: "relay3.alpha.com",
                        general_service: null,
                        ip_address: null,
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.RPC_RELAY
                    }
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            },
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "Second Sample RPC Relay",
                registered_node_id: 15,
                service_endpoints: [
                    {
                        block_node: null,
                        domain_name: "relay1.beta.com",
                        general_service: null,
                        ip_address: "192.168.12.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.RPC_RELAY
                    },
                    {
                        block_node: null,
                        domain_name: null,
                        general_service: null,
                        ip_address: "192.168.42.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: false,
                        rpc_relay: null,
                        type: RegisteredNodeType.RPC_RELAY
                    },
                    {
                        block_node: null,
                        domain_name: "relay3.beta.com",
                        general_service: null,
                        ip_address: null,
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.RPC_RELAY
                    }
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            }
        ]
    }
}
