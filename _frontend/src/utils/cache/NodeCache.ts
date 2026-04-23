// SPDX-License-Identifier: Apache-2.0

import {NetworkNode, NetworkNodesResponse} from "@/schemas/MirrorNodeSchemas";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import axios, {AxiosResponse} from "axios";

export class NodeCache extends SingletonCache<NetworkNode[]> {

    public static readonly instance = new NodeCache()

    //
    // Cache
    //

    protected async load(): Promise<NetworkNode[]> {
        let result: NetworkNode[] = []
        let nextURL: string | null = "api/v1/network/nodes"
        const params = {
            limit: 100 as number | undefined
        }
        while (nextURL !== null) {
            const response: AxiosResponse<NetworkNodesResponse>
                = await axios.get<NetworkNodesResponse>(nextURL, {params: params})
            result = result.concat(response.data.nodes ?? [])
            nextURL = response.data.links?.next ?? null
            params.limit = undefined
        }
        result.forEach((n: NetworkNode) => {
            n.associated_registered_nodes =
                n.node_id % 11 === 0
                    ? [3, 6, 10]
                    : n.node_id % 7 === 0
                        ? [7, 12, 15]
                        : []
        })
        return Promise.resolve(result)
    }
}
