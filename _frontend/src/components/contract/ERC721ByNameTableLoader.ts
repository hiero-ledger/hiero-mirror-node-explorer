// SPDX-License-Identifier: Apache-2.0

import {TableLoader} from "@/utils/table/TableLoader";
import {Ref, watch, WatchStopHandle} from "vue";
import {ERC721Cache, ERC721Contract} from "@/utils/cache/ERC721Cache.ts";

export class ERC721ByNameTableLoader extends TableLoader<ERC721Contract> {

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

    protected async load(): Promise<ERC721Contract[]> {
        let result: ERC721Contract[]
        if (this.name.value !== null) {
            result = await ERC721Cache.instance.search(this.name.value)
        } else {
            result = []
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
