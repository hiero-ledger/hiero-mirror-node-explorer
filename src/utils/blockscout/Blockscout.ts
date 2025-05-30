// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref, watch} from "vue";
import {AppStorage} from "@/AppStorage.ts";

export namespace Blockscout {

    //
    // https://eth.blockscout.com/api-docs
    //

    export interface TokenInfo {
        circulating_market_cap: string|null
        icon_url: string|null
        name: string|null
        decimals: string|null
        symbol: string|null
        address: string
        type: string
        holders: string|null
        exchange_rate: string|null
        total_supply: string
    }


    export interface TokenBalance {
        token_instance?: NFTInstance | null
        value: string
        token_id: string | null
        token: TokenInfo
    }

    export interface NFTInstance {
        is_unique: boolean | null
        id: string
        holder_address_hash: string
        image_url: string | null
        animation_url: string
        external_app_url: string | null
        media_type: string | null
        media_url: string | null
        metadata: object | null
        owner: object | null
        thumbnails: object | null
        token: TokenInfo
    }

    export interface Holder {
        address: AddressParam
        value: string
        token_id: string
    }

    export interface AddressParam {
        hash: string
        implementation_name: string
        name: string
        ens_domain_name: string | null
        metadata: object | null
        is_contract: boolean
        private_tags: AddressTag []
        watchlist_names: WatchlistName []
        public_tags: AddressTag []
        is_verified: boolean
    }

    export interface AddressTag {
        address_hash: string
        display_name: string
        label: string
    }

    export interface WatchlistName {
        display_name: string
        label: string
    }


    export interface Response<T> {
        items: T[]
        next_page_params: NextPageParams|null
    }

    export type TokenInfoResponse = Response<TokenInfo>
    export type TokenBalanceResponse = Response<TokenBalance>
    export type HolderResponse = Response<Holder>
    export type NextPageParams = Record<string, unknown>
}


//
// Blockscout.TableController
//

export namespace Blockscout {

    export class TableController<R> {

        private readonly buffer: RowBuffer<R>
        private mounted = false

        //
        // Public
        //

        public pageSize: Ref<number>

        public readonly currentPage: Ref<number> = computed(() => this.buffer.currentPage.value)

        public readonly rows = computed<R[]>(() => this.buffer.currentRows.value)

        public readonly totalRowCount: ComputedRef<number> = computed(() => {
            let result: number
            if (this.buffer.drained.value) {
                result = this.buffer.allRowCount.value
            } else {
                const k = Math.ceil((this.buffer.allRowCount.value + 1) / this.presumedRowCount.value)
                result = k * this.presumedRowCount.value
            }
            return result
        })

        public readonly loading = computed(() => this.buffer.loading.value)

        public readonly paginated: ComputedRef<boolean> = computed(
            () => this.totalRowCount.value >= this.pageSize.value)


        public readonly onPageChange = (page: number): void => {
            this.buffer.move(page, this.pageSize.value).finally()
        }

        public mount(): void {
            this.mounted = true
            this.onPageChange(1)
        }

        public unmount(): void {
            this.mounted = false
            this.buffer.reset()
        }

        public remount(): void {
            if (this.mounted) {
                this.unmount()
                this.mount()
            }
        }

        //
        // Public (to be subclassed)
        //

        public async load(nextPageParams: NextPageParams|null, blockscoutURL: string): Promise<Response<R>|null> {
            throw new Error("To be subclassed: nextPageParams=" + nextPageParams + ", blockscoutURL=" + blockscoutURL)
        }

        //
        // Protected
        //

        protected constructor(private readonly defaultPageSize: number,
                              private readonly blockscoutURL: Ref<string|null>,
                              pageSizeStorageKey: string) {
            this.pageSize = ref(AppStorage.getTablePageSize(pageSizeStorageKey) ?? defaultPageSize)
            this.buffer = new RowBuffer<R>(this, this.pageSize)
            watch(this.pageSize, () => AppStorage.setTablePageSize(pageSizeStorageKey, this.pageSize.value))
        }

        //
        // Private
        //

        public async loadNext(nextPageParams: NextPageParams|null): Promise<Response<R>|null> {
            let result: Response<R>|null
            if (this.blockscoutURL.value !== null) {
                result = await this.load(nextPageParams, this.blockscoutURL.value)
            } else {
                result = { items: [], next_page_params: null}
            }
            return Promise.resolve(result)
        }

        private readonly presumedRowCount = computed(() => this.pageSize.value * 10)
    }

    class RowBuffer<R> {

        public readonly loading = ref(false)
        private readonly allRows = ref<R[]>([]) as Ref<R[]>
        private readonly startIndex = ref<number>(-1)
        private readonly nextPageParams = ref<NextPageParams|null>(null)
        private readonly loadCount = ref(0)

        constructor(private readonly controller: TableController<R>, private readonly pageSize: Ref<number>) {}

        readonly currentRows = computed<R[]>(() => {
            let result: R[]
            if (this.startIndex.value !== -1) {
                result = this.allRows.value.slice(this.startIndex.value, this.endIndex.value)
            } else {
                result = []
            }
            return result
        })

        readonly currentPage = computed<number>(() => {
            let result: number
            if (this.startIndex.value !== -1) {
                result = Math.floor(this.startIndex.value / this.pageSize.value) + 1
            } else {
                result = -1
            }
            return result
        })

        readonly allRowCount = computed(
            () => this.allRows.value.length)

        readonly drained = computed(
            () => this.loadCount.value >= 1 && this.nextPageParams.value === null)

        async move(pageNo: number, pageSize: number): Promise<void> {
            const newStartIndex = (pageNo - 1) * pageSize
            const newEndIndex = newStartIndex + pageSize
            while (newEndIndex > this.allRows.value.length && !this.drained.value) {
                await this.loadNext()
            }
            if (newStartIndex < this.allRows.value.length) {
                this.startIndex.value = newStartIndex
                this.pageSize.value = pageSize
            }
            // else leaves this.startIndex and this.pageSize unchanged
        }

        reset(): void {
            this.allRows.value = []
            this.startIndex.value = -1
            this.pageSize.value = 10
            this.nextPageParams.value = null
            this.loadCount.value = 0
        }

        //
        // Private
        //

        private readonly endIndex = computed(() => {
            let result: number
            if (this.startIndex.value !== -1) {
                result = Math.min(this.startIndex.value + this.pageSize.value, this.allRows.value.length)
            } else {
                result = -1
            }
            return result
        })

        private async loadNext(): Promise<void> {
            this.loading.value = true
            this.loadCount.value += 1
            try {
                const r = await this.controller.loadNext(this.nextPageParams.value)
                this.allRows.value = this.allRows.value.concat(r?.items ?? [])
                this.nextPageParams.value = r?.next_page_params ?? null
            } catch(reason) {
                // Leaves this.allRows unchanged
                this.nextPageParams.value = null
                console.error(reason)
            } finally {
                this.loading.value = false
            }
        }
    }

}
