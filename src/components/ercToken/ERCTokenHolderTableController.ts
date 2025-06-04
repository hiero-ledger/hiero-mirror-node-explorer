// SPDX-License-Identifier: Apache-2.0

import {Ref, watch} from "vue";
import axios from "axios";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";

export class ERCTokenHolderTableController extends Blockscout.TableController<Blockscout.Holder> {

    public constructor(private readonly tokenAddress: Ref<string | null>,
                       defaultPageSize: number,
                       blockscoutURL: Ref<string | null>,
                       storageKey: string) {
        super(defaultPageSize, blockscoutURL, storageKey)
        watch(this.tokenAddress, () => this.remount())
    }

    public async load(nextPageParams: Blockscout.NextPageParams | null, blockscoutURL: string): Promise<Blockscout.HolderResponse | null> {
        let result: Blockscout.HolderResponse | null
        if (this.tokenAddress.value !== null) {
            const config = nextPageParams !== null ? {params: nextPageParams} : {}
            const url = blockscoutURL + "api/v2/tokens/" + this.tokenAddress.value + "/holders"
            const r = await axios.get<Blockscout.HolderResponse>(url, config)
            result = r.data
        } else {
            result = null
        }
        return Promise.resolve(result)
    }
}

