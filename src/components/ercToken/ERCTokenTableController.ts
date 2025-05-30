// SPDX-License-Identifier: Apache-2.0

import {Ref} from "vue";
import axios from "axios";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";

export class ERCTokenTableController extends Blockscout.TableController<Blockscout.TokenInfo> {

    public constructor(defaultPageSize: number, blockscoutURL: Ref<string|null>, storageKey: string) {
        super(defaultPageSize, blockscoutURL, storageKey)
    }

    public async load(nextPageParams: Blockscout.NextPageParams | null, blockscoutURL: string): Promise<Blockscout.TokenInfoResponse | null> {
        const config = nextPageParams !== null ? { params: nextPageParams } : {}
        const url = blockscoutURL + "api/v2/tokens"
        const r = await axios.get<Blockscout.TokenInfoResponse>(url, config)
        return r.data
    }
}

