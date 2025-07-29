// SPDX-License-Identifier: Apache-2.0

import {ContractAction, ContractActionsResponse} from "@/schemas/MirrorNodeSchemas";
import axios, {AxiosResponse} from "axios";
import {computed, Ref, watch, WatchStopHandle} from "vue";
import {EntityLoader} from "@/utils/loader/EntityLoader.ts";

const MAX_DEPTH_LEVEL = 20

export interface ContractActionWithPath {
    action: ContractAction,
    depthPath: string
}

export class ContractActionsLoader extends EntityLoader<ContractActionsResponse> {

    public readonly transactionIdOrHash: Ref<string | null>
    private watchStopHandle: WatchStopHandle | null = null

    //
    // Public
    //

    public constructor(transactionIdOrHash: Ref<string | null>) {
        super(0, 0)
        this.transactionIdOrHash = transactionIdOrHash
    }

    // public readonly actionsWithPath: Ref<Array<ContractActionWithPath>> = ref([])
    public readonly actions = computed(() => this.entity.value?.actions ?? null)

    public readonly actionsWithPath = computed(() => {

        const result: Array<ContractActionWithPath> = []

        if (this.actions.value !== null) {
            const depthVector: Array<number> = []
            for (const a of this.actions.value) {
                result.push({
                    action: a,
                    depthPath: ContractActionsLoader.buildDepthPath(a.call_depth ?? 0, depthVector)
                } as ContractActionWithPath)
            }
        }

        return result
    })

    //
    // EntityLoader
    //

    public mount(): void {
        super.mount()
        this.watchStopHandle = watch(this.transactionIdOrHash, () => {
            this.pause()
            this.resume()
        })
    }

    public unmount(): void {
        if (this.watchStopHandle != null) {
            this.watchStopHandle()
            this.watchStopHandle = null
        }
        super.unmount()
    }

    protected async load(): Promise<ContractActionsResponse | null> {
        let result: ContractActionsResponse | null = null
        if (this.transactionIdOrHash.value) {
            let url: string | null = "api/v1/contracts/results/" + this.transactionIdOrHash.value + "/actions?limit=100"
            while (url !== null) {
                const response: AxiosResponse<ContractActionsResponse> = await axios.get(url)
                const next = response.data
                result = result !== null ? this.mergeResponses(result, next) : next
                url = next.links?.next ?? null
            }
        }
        return Promise.resolve(result)
    }

    //
    // Private
    //

    private mergeResponses(last: ContractActionsResponse,
                           next: ContractActionsResponse): ContractActionsResponse {
        const lastActions = last.actions ?? []
        const nextActions = next.actions ?? []
        last.actions = lastActions.concat(nextActions)
        return last
    }

    private static buildDepthPath(depth: number, depthVector: Array<number>) {
        let result = ""

        if (depthVector.length >= depth + 1) {
            depthVector[depth]++
            depthVector.splice(depth + 1)
        } else {
            depthVector.push(1)
        }

        for (let i = 0; i < depthVector.length && i < MAX_DEPTH_LEVEL; i++) {
            if (i < MAX_DEPTH_LEVEL - 1) {
                result += (i === 0) ? depthVector[i] : "_" + depthVector[i]
            } else {
                result += '(…)'
            }
        }

        return result
    }
}
