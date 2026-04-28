// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref, watch, WatchSource, WatchStopHandle} from "vue";
import {Router} from "vue-router";
import {fetchNumberQueryParam} from "@/utils/RouteManager";
import {RowBufferV2} from "@/utils/table/RowBufferV2.ts";
import {PlayPauseController} from "@/components/PlayPauseButton.vue";
import {AppStorage} from "@/AppStorage.ts";
import {abortableWaitFor} from "@/utils/TimerUtils.ts";

export abstract class TableControllerV2<R, K> implements PlayPauseController {

    //
    // Public
    //

    public pageSize: Ref<number>

    public readonly currentPage: Ref<number> = ref(1)

    public readonly rows: ComputedRef<R[]> = computed(() => {
        const startIndex = this.buffer.startIndex.value
        const endIndex = startIndex + this.pageSize.value
        return this.buffer.rows.value.slice(startIndex, endIndex)
    })

    public readonly totalRowCount: ComputedRef<number> = computed(
        () => this.buffer.totalRowCount.value)

    public readonly loading: Ref<boolean> = ref(false)

    public readonly paginated: ComputedRef<boolean> = computed(
        () => this.buffer.totalRowCount.value >= this.pageSize.value)

    public readonly mounted: ComputedRef<boolean> = computed(() => this.mountedRef.value)

    public readonly showPageSizeSelector = computed(() => this.buffer.totalRowCount.value > 5)

    //
    // Public (mount / unmount)
    //

    public mount() {
        this.mountedRef.value = true
        this.startWatchingSources()
        const pageParam = this.getPageParam()
        if (pageParam !== null) {
            this.moveToPage(pageParam).catch()
        } else {
            this.startAutoRefresh()
        }
    }

    public async unmount(): Promise<void> {
        this.mountedRef.value = false
        this.stopWatchingSources()
        await this.stopAutoRefreshAsync()
    }

    public readonly moveToPage = async (page: number): Promise<void> => {
        if (this.mountedRef.value) {
            await this.stopAutoRefreshAsync()
            await this.buffer.moveToPage(page)
        }
    }

    public async reset(): Promise<void> {
        await this.buffer.clear()
    }
    //
    // public async refresh(): Promise<void> {
    //     await this.buffer.clear()
    //     await this.buffer.refresh()
    //     await this.bufferDidChange()
    // }

    //
    // Public (to be subclassed)
    //

    public abstract keyFor(row: R): K

    public abstract stringFromKey(key: K): string

    public abstract keyFromString(s: string): K | null

    public async headLoad(headKey: K, limit: number): Promise<R[] | null> {
        throw new Error("To be subclassed: headKey=" + headKey + ", limit=" + limit)
    }

    public async tailLoad(tailKey: K | null, limit: number): Promise<R[] | null> {
        throw new Error("To be subclassed: tailKey=" + tailKey + ", limit=" + limit)
    }

    //
    // Public (for RowBufferV2)
    //

    public async bufferDidChange(): Promise<void> {
        this.currentPage.value = this.buffer.currentPage.value
    }

    //
    // PlayPauseController
    //

    private readonly autoRefreshPromise = ref<Promise<void>|null>(null)
    private autoRefreshController: AbortController|null = null

    public autoRefresh: ComputedRef<boolean> = computed(() => this.autoRefreshPromise.value !== null)

    public startAutoRefresh(): void {
        if (this.mountedRef.value && this.autoRefreshPromise.value === null) {
            const runAutoRefresh = async () => {
                let refreshCount = 0
                this.autoRefreshController = new AbortController()
                while (refreshCount < this.maxAutoUpdateCount && !this.autoRefreshController.signal.aborted) {
                    await this.buffer.refresh()
                    await abortableWaitFor(this.updatePeriod, this.autoRefreshController.signal)
                    refreshCount += 1
                }
                this.autoRefreshController = null
            }
            this.autoRefreshPromise.value = runAutoRefresh()
        }
    }

    public stopAutoRefresh(): void {
        this.stopAutoRefreshAsync().catch()
    }

    private async stopAutoRefreshAsync(): Promise<void> {
        if (this.autoRefreshPromise.value !== null) {
            this.autoRefreshController?.abort()
            await this.buffer.abortCurrentTask()
            try {
                await this.autoRefreshPromise.value
            } finally {
                this.autoRefreshPromise.value = null
            }
        }
    }

    //
    // Protected
    //

    protected constructor(private readonly router: Router,
                          private readonly updatePeriod: number,
                          private readonly maxAutoUpdateCount: number,
                          private readonly pageParamName = "p",
                          defaultPageSize: number,
                          pageSizeStorageKey: string) {
        this.pageSize = ref(AppStorage.getTablePageSize(pageSizeStorageKey) ?? defaultPageSize)
        this.buffer = new RowBufferV2(this, this.pageSize.value * 10)
        watch(this.pageSize, () => AppStorage.setTablePageSize(pageSizeStorageKey, this.pageSize.value))
    }

    protected watchAndReload(sources: WatchSource<unknown>[]): void {
        this.sources = sources
        if (this.mounted.value) {
            this.startWatchingSources()
        }
    }

    //
    // Private
    //

    private readonly buffer: RowBufferV2<R, K>
    private readonly mountedRef = ref<boolean>(false)

    private getPageParam(): number | null {
        return fetchNumberQueryParam(this.pageParamName, this.router.currentRoute.value)
    }


    //
    // Private (xxxWatchingSources)
    //

    private sources: WatchSource[] = []
    private watchSourcesHandle: WatchStopHandle | null = null

    private startWatchingSources(): void {
        this.stopWatchingSources()
        this.watchSourcesHandle = watch(this.sources, () => this.sourcesDidChange())
    }

    private stopWatchingSources(): void {
        if (this.watchSourcesHandle !== null) {
            this.watchSourcesHandle()
            this.watchSourcesHandle = null
        }
    }

    private async sourcesDidChange(): Promise<void> {
        if (this.mountedRef.value) {
            const oldAutoRefresh = this.autoRefresh.value
            await this.stopAutoRefreshAsync()
            await this.reset()
            if (oldAutoRefresh) {
                this.startAutoRefresh()
            } else {
                await this.moveToPage(1)
            }
        }
    }


}
