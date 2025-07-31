// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {StakingReward, StakingRewardsResponse} from "@/schemas/MirrorNodeSchemas";
import {ref, Ref, watch} from "vue";
import axios from "axios";
import {Router} from "vue-router";


export class StakingRewardsTableController extends TableController<StakingReward, string> {

    public readonly accountId: Ref<string | null>
    public storageKey: string

    //
    // Public
    //

    public constructor(router: Router,
                       accountId: Ref<string | null>,
                       defaultPageSize: number,
                       storageKey: string,
                       pageParamName = "p",
                       keyParamName = "k") {
        super(router,
            defaultPageSize,
            5000,
            0,
            100,
            storageKey,
            pageParamName,
            keyParamName);
        this.accountId = accountId
        this.storageKey = storageKey
        this.watchAndReload([this.accountId, this.pageSize])
        watch(this.accountId, this.updateAvailableAPI)
    }

    //
    // TableController
    //

    public async load(consensusTimestamp: string | null, operator: KeyOperator,
                      order: SortOrder, limit: number): Promise<StakingReward[] | null> {
        let result: StakingReward[] | null

        const accountId = this.accountId.value
        if (accountId === null) {
            result = null
        } else {
            const params = {} as {
                limit: number
                timestamp: string | undefined,
                order: string
            }
            params.limit = limit
            params.order = order
            if (consensusTimestamp !== null) {
                params.timestamp = operator + ":" + consensusTimestamp
            }
            const url = "api/v1/accounts/" + accountId + "/rewards"
            const response = await axios.get<StakingRewardsResponse>(url, {params: params})
            result = response.data.rewards ?? []
        }

        return Promise.resolve(result)
    }

    public keyFor(row: StakingReward): string {
        return row.timestamp ?? ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }


    //
    // To be removed when mainnet supports api/v1/accounts/{accountId}/rewards
    //

    public availableAPI: Ref<boolean> = ref(false)

    private readonly updateAvailableAPI = () => {
        if (this.accountId.value !== null) {
            const url = "api/v1/accounts/" + this.accountId.value + "/rewards?limit=1"
            axios.get<StakingRewardsResponse>(url)
                .then(() => this.availableAPI.value = true)
                .catch(() => this.availableAPI.value = false)
        } else {
            this.availableAPI.value = true
        }
    }
}
