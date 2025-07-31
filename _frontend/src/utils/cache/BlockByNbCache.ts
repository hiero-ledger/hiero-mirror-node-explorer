// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {Block} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";
import {BlockByHashCache} from "@/utils/cache/BlockByHashCache";

export class BlockByNbCache extends EntityCache<number, Block | null> {

    public static readonly instance = new BlockByNbCache()

    //
    // Public
    //

    public updateWithBlock(block: Block): void {
        if (block.number) {
            this.forget(block.number)
            this.mutate(block.number, Promise.resolve(block))
        }
    }

    //
    // Cache
    //

    protected async load(nb: number): Promise<Block | null> {
        let result: Promise<Block | null>

        try {
            const response = await axios.get<Block>("api/v1/blocks/" + nb)
            result = Promise.resolve(response.data)
            BlockByHashCache.instance.updateWithBlock(response.data)
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

