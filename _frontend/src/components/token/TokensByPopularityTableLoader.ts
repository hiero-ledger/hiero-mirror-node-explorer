// SPDX-License-Identifier: Apache-2.0

import {TableLoader} from "@/utils/table/TableLoader";
import {Token} from "@/schemas/MirrorNodeSchemas";
import {Ref, watch, WatchStopHandle} from "vue";
import {SelectedTokensCache} from "@/utils/cache/SelectedTokensCache";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";

export class TokensByPopulariyTableLoader extends TableLoader<Token> {

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
        const result: Token[] = []
        if (this.name.value !== null) {
            const index = await SelectedTokensCache.instance.lookup()
            const indexEntries = index.search(this.name.value)
            for (const e of indexEntries) {
                const token = await TokenInfoCache.instance.lookup(e.token_id)
                if (token !== null) {
                    result.push(token as unknown as Token)
                }
            }
        }
        return Promise.resolve(result)
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
