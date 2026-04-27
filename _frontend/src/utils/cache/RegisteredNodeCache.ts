// SPDX-License-Identifier: Apache-2.0

import {RegisteredNode, RegisteredNodesResponse, RegisteredNodeType} from "@/schemas/MirrorNodeSchemas";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import axios, {AxiosResponse} from "axios";

const mockRegisteredNodes = import.meta.env.VITE_APP_MOCK_HIP_1137 === "true"

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
        let result: RegisteredNode[]

        if (mockRegisteredNodes) {
            result = this.getMock()
        } else {
            result = []
            let nextURL: string | null = "api/v1/network/registered-nodes"
            const params = {
                limit: 100 as number | undefined,
                type: this.nodeType
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
