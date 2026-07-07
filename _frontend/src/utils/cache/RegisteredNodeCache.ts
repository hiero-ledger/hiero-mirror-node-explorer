// SPDX-License-Identifier: Apache-2.0

import {
    KeyType,
    RegisteredBlockNodeApi,
    RegisteredNode,
    RegisteredNodesResponse,
    RegisteredNodeType
} from "@/schemas/MirrorNodeSchemas";
import {SingletonCache, SingletonLookup} from "@/utils/cache/base/SingletonCache";
import axios, {AxiosResponse} from "axios";
import {computed} from "vue";

const mockRegisteredNodes = import.meta.env.VITE_APP_MOCK_HIP_1137 === "true"

export class RegisteredNodeCache extends SingletonCache<RegisteredNode[]> {

    public static readonly instance = new RegisteredNodeCache()

    public makeLookup(): RegisteredNodeLookup {
        return new RegisteredNodeLookup(this)
    }

    // eslint-disable-next-line max-lines-per-function
    protected getMock(): RegisteredNode[] {
        return [
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "Sample Registered Node 1",
                registered_node_id: 1,
                service_endpoints: [
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF]
                        },
                        domain_name: "block1.alpha.com",
                        general_service: null,
                        ip_address: "192.168.1.42",
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
                        domain_name: "block2.alpha.com",
                        general_service: null,
                        ip_address: null,
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
                    },
                    {
                        block_node: {
                            endpoint_apis: [RegisteredBlockNodeApi.STATE_PROOF, RegisteredBlockNodeApi.PUBLISH, RegisteredBlockNodeApi.OTHER]
                        },
                        domain_name: null,
                        general_service: null,
                        ip_address: "192.168.1.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.BLOCK_NODE
                    },
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            },
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "Sample Registered Node 2",
                registered_node_id: 2,
                service_endpoints: [
                    {
                        block_node: null,
                        domain_name: "mirror1.alpha.com",
                        general_service: null,
                        ip_address: "192.168.12.42",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.MIRROR_NODE
                    },
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            },
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "Sample Registered Node 3",
                registered_node_id: 3,
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
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            },
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "Sample Registered Node 4",
                registered_node_id: 4,
                service_endpoints: [
                    {
                        block_node: null,
                        domain_name: null,
                        general_service: {
                            description: "This is a mocked-up general service",
                        },
                        ip_address: "192.168.12.12",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.GENERAL_SERVICE
                    },
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            },
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "Sample Registered Node 10",
                registered_node_id: 10,
                service_endpoints: [
                    {
                        block_node: null,
                        domain_name: "general.service.com",
                        general_service: {
                            description: "This is another mocked-up general service",
                        },
                        ip_address: null,
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.GENERAL_SERVICE
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
                    },
                    {
                        block_node: null,
                        domain_name: "mirror2.alpha.com",
                        general_service: null,
                        ip_address: null,
                        mirror_node: null,
                        port: 40840,
                        requires_tls: false,
                        rpc_relay: null,
                        type: RegisteredNodeType.MIRROR_NODE
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
                        domain_name: null,
                        general_service: {
                            description: "This is a mocked-up general service",
                        },
                        ip_address: "192.168.1.12",
                        mirror_node: null,
                        port: 40840,
                        requires_tls: true,
                        rpc_relay: null,
                        type: RegisteredNodeType.GENERAL_SERVICE
                    },
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            },
        ]
    }

    //
    // Cache
    //

    protected async load(): Promise<RegisteredNode[]> {
        let result: RegisteredNode[]

        if (mockRegisteredNodes) {
            result = this.getMock()
        } else {
            result = []
            let nextURL: string | null = "api/v1/network/registered-nodes"
            const params = {
                limit: 100 as number | undefined,
            }
            while (nextURL !== null) {
                const response: AxiosResponse<RegisteredNodesResponse>
                    = await axios.get<RegisteredNodesResponse>(nextURL, {params: params})
                result = result.concat(response.data.registered_nodes ?? [])
                nextURL = response.data.links?.next ?? null
                params.limit = undefined
            }
        }
        return Promise.resolve(result)
    }
}

export class RegisteredNodeLookup extends SingletonLookup<RegisteredNode[]> {

    //
    // Public
    //

    public readonly registeredNodes = computed(() => this.entity.value ?? [])

    constructor(cache: RegisteredNodeCache) {
        super(cache)
    }
}