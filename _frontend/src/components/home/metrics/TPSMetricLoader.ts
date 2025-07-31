// SPDX-License-Identifier: Apache-2.0

import {computed} from "vue";
import {EntityLoader} from "@/utils/loader/EntityLoader.ts";
import {Block, BlocksResponse} from "@/schemas/MirrorNodeSchemas.ts";
import axios, {AxiosResponse} from "axios";
import {computeTPS} from "@/schemas/MirrorNodeUtils.ts";

export class TPSMetricLoader extends EntityLoader<Block[]> {

    private readonly sampleCount = 100 // tps is computed over the last 'sampleCount' blocks

    private readonly formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    //
    // Public
    //

    public constructor() {
        // Refresh every 5s, forever
        super(10 * 1000, EntityLoader.HUGE_COUNT)
    }

    public readonly currentTPS = computed(() => {
        let result: string | null
        if (this.entity.value !== null) {
            const tps = computeTPS(this.entity.value)
            result = tps !== null ? this.formatter.format(tps) : null
        } else {
            result = null
        }
        return result
    })


    //
    // EntityLoader
    //

    protected async load(): Promise<Block[]> {
        let result: Block[]

        const blocks = this.entity.value
        const blockCount = blocks?.length ?? 0
        const lastBlock = blocks && blockCount >= 1 ? blocks[blockCount - 1] : null

        const lastBlockNb = lastBlock?.number ?? null
        const newBlocks = await this.loadBlocks(lastBlockNb)
        const firstNewBlock = newBlocks.length >= 1 ? newBlocks[0] : null

        if (blocks !== null && firstNewBlock !== null && firstNewBlock.number == lastBlockNb) {
            // firstNewBlock matches lastBlock => removes it from newBlocks (because it's duplicate)
            newBlocks.splice(0, 1)
            result = blocks.concat(newBlocks).slice(-this.sampleCount)
        } else {
            // firstNewBlock does no match lastBlock => we forget all the current records
            result = newBlocks
        }

        return Promise.resolve(result)
    }

    //
    // Private
    //

    private async loadBlocks(lastBlockNb: number | null): Promise<Block[]> {

        const blockFilter = lastBlockNb !== null ? "&block.number=gte:" + lastBlockNb : ""
        const limit = Math.min(100, this.sampleCount)

        let result: Block[] = []
        let nextURL: string | null = "api/v1/blocks?limit=" + limit + blockFilter
        while (nextURL !== null && result.length < this.sampleCount) {
            const response: AxiosResponse<BlocksResponse> = await axios.get<BlocksResponse>(nextURL)
            result = result.concat(response.data.blocks ?? [])
            nextURL = response.data.links?.next ?? null
        }
        result.reverse()
        return result
    }

}
