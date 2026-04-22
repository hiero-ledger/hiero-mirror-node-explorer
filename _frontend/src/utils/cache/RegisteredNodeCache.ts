// SPDX-License-Identifier: Apache-2.0

import {RegisteredNode, RegisteredNodeType} from "@/schemas/MirrorNodeSchemas";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";

export class RegisteredNodeCache extends SingletonCache<RegisteredNode[]> {

    private nodeType: RegisteredNodeType

    protected constructor(nodeType: RegisteredNodeType) {
        super()
        this.nodeType = nodeType
    }

    protected getMock(): RegisteredNode[] {
        return []
    }

    //
    // Cache
    //

    protected async load(): Promise<RegisteredNode[]> {

        console.log("RegisteredNodeCache.load() - nodeType: " + this.nodeType)
        // let result: RegisteredNode[] = []
        // let nextURL: string | null = "api/v1/network/registered-nodes"
        // const params = {
        //     limit: 100 as number | undefined,
        //     type: this.nodeType
        // }
        // while (nextURL !== null) {
        //     const response: AxiosResponse<RegisteredNodesResponse>
        //         = await axios.get<RegisteredNodesResponse>(nextURL, {params: params})
        //     result = result.concat(response.data.registered_nodes ?? [])
        //     nextURL = response.data.links?.next ?? null
        //     params.limit = undefined
        // }

        const result = this.getMock()

        return Promise.resolve(result)
    }
}
