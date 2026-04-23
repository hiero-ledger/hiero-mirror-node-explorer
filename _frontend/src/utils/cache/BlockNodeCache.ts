// SPDX-License-Identifier: Apache-2.0

import {KeyType, RegisteredBlockNodeApi, RegisteredNode, RegisteredNodeType} from "@/schemas/MirrorNodeSchemas";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";

export class BlockNodeCache extends RegisteredNodeCache {

    public static readonly instance = new BlockNodeCache(RegisteredNodeType.BLOCK_NODE)

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
                description: "First Sample Block Node",
                registered_node_id: 3,
                service_endpoints: [
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF]
                        },
                        domain_name: "block1.alpha.com",
                        general_service: null,
                        ip_address: "192.168.12.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
                    },
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF]
                        },
                        domain_name: null,
                        general_service: null,
                        ip_address: "192.168.42.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: false,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
                    },
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF]
                        },
                        domain_name: "block3.alpha.com",
                        general_service: null,
                        ip_address: null,
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
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
                description: "Second Sample Block Node",
                registered_node_id: 12,
                service_endpoints: [
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF]
                        },
                        domain_name: "block1.beta.com",
                        general_service: null,
                        ip_address: "192.168.12.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
                    },
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF]
                        },
                        domain_name: null,
                        general_service: null,
                        ip_address: "192.168.42.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: false,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
                    },
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF]
                        },
                        domain_name: "block3.beta.com",
                        general_service: null,
                        ip_address: null,
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
                    }
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            }
        ]
    }
}
