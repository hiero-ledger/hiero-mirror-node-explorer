// SPDX-License-Identifier: Apache-2.0

import {KeyType, RegisteredNode, RegisteredNodeType} from "@/schemas/MirrorNodeSchemas";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";

export class GeneralServiceCache extends RegisteredNodeCache {

    public static readonly instance = new GeneralServiceCache(RegisteredNodeType.GENERAL_SERVICE)

    //
    // RegisteredNodeCache
    //

    protected getMock(): RegisteredNode[] {

        return [
            {
                admin_key: {
                    "_type": KeyType.ED25519,
                    "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"
                },
                created_timestamp: "1648377044.798291252",
                description: "First Sample General Service",
                registered_node_id: 1,
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
                    }
                ],
                timestamp: {"from": "1648377044.798291252", "to": null}
            }
        ]
    }
}
