// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {Block} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";
import {BlockByNbCache} from "@/utils/cache/BlockByNbCache";

export class BlockByHashCache extends EntityCache<string, Block | null> {

    public static readonly instance = new BlockByHashCache()

    //
    // Public
    //

    public updateWithBlock(block: Block): void {
        if (block.hash) {
            this.forget(block.hash)
            this.mutate(block.hash, Promise.resolve(block))
        }
    }

    //
    // Cache
    //

    protected async load(hash: string): Promise<Block | null> {
        let result: Promise<Block | null>

        try {
            const response = await axios.get<Block>("api/v1/blocks/" + hash)
            result = Promise.resolve(response.data)
            BlockByNbCache.instance.updateWithBlock(response.data)
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

