// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref} from "vue";

export abstract class TableLoader<R> {

    private readonly allRows: Ref<R[]> = ref([])
    private readonly loadError = ref<unknown>(null)
    private readonly mounting = ref<boolean>(false)
    private readonly mounted = ref<boolean>(false)

    //
    // Public
    //

    public async mount(): Promise<void> {
        if (!this.mounted.value) {
            this.mounting.value = true
            try {
                this.allRows.value = await this.load()
                this.loadError.value = null
                this.mounted.value = true
            } catch (reason) {
                this.allRows.value = []
                this.loadError.value = reason
                this.mounted.value = false
            } finally {
                this.mounting.value = false
            }
        } else {
            console.log("TableLoader.mount() aborts because loader is already mounted")
        }
    }

    public unmount(): void {
        if (this.mounted.value) {
            this.allRows.value = []
            this.loadError.value = null
            this.mounted.value = false
        } else {
            console.log("TableLoader.unmount() aborts because loader is not mounted")
        }
    }

    public async remount(): Promise<void> {
        if (this.mounted.value) {
            this.unmount()
            await this.mount()
        }
    }

    public readonly currentPage: Ref<number> = ref(1)

    public readonly rows
        = computed(() => this.allRows.value.slice(this.startIndex.value, this.endIndex.value))

    public readonly totalRowCount
        = computed(() => this.allRows.value.length)

    public readonly loading
        = computed(() => this.mounting.value)

    //
    // Protected (to be subclassed)
    //

    protected async load(): Promise<R[]> {
        throw new Error("To be subclassed")
    }

    //
    // Protected
    //

    protected constructor(public readonly pageSize: Ref<number>) {
    }

    //
    // Private
    //

    private readonly startIndex
        = computed(() => (this.currentPage.value - 1) * this.pageSize.value)

    private readonly endIndex
        = computed(() => this.startIndex.value + this.pageSize.value)


}
