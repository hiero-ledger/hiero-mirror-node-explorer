// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {Block, BlocksResponse} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class BlockByTsCache extends EntityCache<string, Block | null> {

    public static readonly instance = new BlockByTsCache()

    //
    // Cache
    //

    protected async load(timestamp: string): Promise<Block | null> {
        let result: Promise<Block | null>

        // timestamp=gte:1598572646.192587000&order=asc&limit=1

        const params = {} as {
            timestamp: string
            limit: number
            order: string
        }
        params.timestamp = 'gte:' + timestamp
        params.limit = 1
        params.order = 'asc'
        try {
            const response = await axios.get<BlocksResponse>("api/v1/blocks", {params: params})
            const blocks = response.data.blocks ?? []
            result = Promise.resolve(blocks.length >= 1 ? blocks[0] : null)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = Promise.resolve(null)
            } else {
                throw error
            }
        }
        return result
    }

}

