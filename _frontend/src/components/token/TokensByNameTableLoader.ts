// SPDX-License-Identifier: Apache-2.0

import {Token, TokensResponse} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";
import {Ref, watch, WatchStopHandle} from "vue";
import {TableLoader} from "@/utils/table/TableLoader";

export class TokensByNameTableLoader extends TableLoader<Token> {

    private readonly name: Ref<string | null>
    private nameWatchHandle: WatchStopHandle | null = null

    //
    // Public
    //

    public constructor(pageSize: Ref<number>, name: Ref<string | null>) {
        super(pageSize)
        this.name = name
    }

    //
    // Protected (to be subclassed)
    //

    protected async load(): Promise<Token[]> {
        const params = {
            limit: 100,
            name: this.name.value
        }
        const r = await axios.get<TokensResponse>("api/v1/tokens", {params: params})
        return Promise.resolve(r.data.tokens ?? [])
    }

    public async mount(): Promise<void> {
        this.nameWatchHandle = watch(this.name, () => this.remount())
        return super.mount()
    }

    public unmount() {
        super.unmount()
        if (this.nameWatchHandle !== null) {
            this.nameWatchHandle()
        }
    }

}
