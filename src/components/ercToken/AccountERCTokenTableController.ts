// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {Ref, watch} from "vue";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";

export class AccountERCTokenTableController extends Blockscout.TableController<Blockscout.TokenBalance> {

    public constructor(private readonly accountAddress: Ref<string|null>,
                       defaultPageSize: number,
                       blockscoutURL: Ref<string|null>,
                       storageKey: string) {
        super(defaultPageSize, blockscoutURL, storageKey)
        watch(this.accountAddress, () => this.remount())
    }

    public async load(nextPageParams: Blockscout.NextPageParams | null, blockscoutURL: string): Promise<Blockscout.TokenBalanceResponse|null> {
        let result:Blockscout.TokenBalanceResponse | null
        if (this.accountAddress.value !== null) {
            const config = nextPageParams !== null ? { params: nextPageParams } : {}
            const url = blockscoutURL + "api/v2/addresses/" + this.accountAddress.value + "/tokens"
            const r = await axios.get<Blockscout.TokenBalanceResponse>(url, config)
            result = r.data
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

}
