// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0


import {computed, ComputedRef, ref, Ref} from "vue";
import {TableControllerV2} from "@/utils/table/TableControllerV2.ts";

export class RowBufferV2<R, K> {

    private readonly tableController: TableControllerV2<R, K>
    private readonly presumedRowCount: number

    public readonly rows: Ref<R[]> = ref([])
    public readonly startIndex: Ref<number> = ref(0)
    public readonly drained: Ref<boolean> = ref(false)

    private readonly currentTask = ref<Promise<void>|null>(null);
    private readonly abortController = new AbortController()

    //
    // Public
    //

    public constructor(controller: TableControllerV2<R, K>, presumedRowCount: number) {
        this.tableController = controller
        this.presumedRowCount = presumedRowCount
    }

    public readonly totalRowCount: ComputedRef<number> = computed(() => {
        let result: number
        const bufferLength = this.rows.value.length
        if (this.drained.value) {
            result = bufferLength
        } else {
            const k = Math.ceil((bufferLength + 1) / this.presumedRowCount)
            result = k * this.presumedRowCount
        }
        return result
    })

    private readonly tailKey: ComputedRef<K | null> = computed(() => {
        const bufferLength = this.rows.value.length
        const tailRow = bufferLength >= 1 ? this.rows.value[bufferLength - 1] : null
        return tailRow !== null ? this.tableController.keyFor(tailRow) : null
    })

    private readonly headKey: ComputedRef<K | null> = computed(() => {
        const bufferLength = this.rows.value.length
        const headRow = bufferLength >= 1 ? this.rows.value[0] : null
        return headRow !== null ? this.tableController.keyFor(headRow) : null
    })

    public readonly currentPage = computed(() => {
        const pageSize = this.tableController.pageSize.value
        return Math.floor(this.startIndex.value / pageSize) + 1
    })

    public readonly maxStartIndex: ComputedRef<number> = computed(() => {
        const pageSize = this.tableController.pageSize.value
        const pageCount = Math.floor(this.rows.value.length / pageSize) + 1
        return Math.max(0, (pageCount - 1) * pageSize)
    })

    public readonly loading = computed(() => this.currentTask.value !== null)

    public async abortCurrentTask() {
        if (this.currentTask.value !== null) {
            this.abortController.abort()
            try {
                await this.currentTask.value
            } finally {
                this.currentTask.value = null
            }
        }
    }

    //
    // Public (refresh)
    //

    public async refresh(): Promise<void> {
        await this.abortCurrentTask()
        this.currentTask.value = this.handleRefresh()
        try {
            await this.currentTask.value
        } finally {
            this.currentTask.value = null
        }
    }

    private async handleRefresh(): Promise<void> {
        const pageSize = this.tableController.pageSize.value
        try {
            if (this.headKey.value === null) {
                // Buffer is empty => we call tailLoad(null)
                this.rows.value = await this.tableController.tailLoad(null, pageSize) ?? []
                this.drained.value = this.rows.value.length < pageSize
                this.startIndex.value = 0
            } else {
                // We have some rows => we call headLoad(headKey)
                const newRows = await this.tableController.headLoad(this.headKey.value, pageSize) ?? []
                this.rows.value = newRows.concat(this.rows.value).slice(0, pageSize)
                this.startIndex.value = 0
                this.drained.value = false
            }
        } catch(error) {
            console.error(error)
            // this.rows unchanged
            // this.drained unchanged
            // this.startIndex unchanged
        }
        await this.tableController.bufferDidChange()
    }

    //
    // Public (moveToPage)
    //

    public async moveToPage(page: number): Promise<void> {
        await this.abortCurrentTask()
        this.currentTask.value = this.handleMoveToPage(page)
        try {
            await this.currentTask.value
        } finally {
            this.currentTask.value = null
        }
    }

    private async handleMoveToPage(page: number): Promise<void> {
        const pageSize = this.tableController.pageSize.value
        const nextStartIndex = (page - 1) * pageSize
        const nextEndIndex = nextStartIndex + pageSize
        const bufferLength = this.rows.value.length
        const tailKey = this.tailKey.value

        try {
            if (tailKey === null) {

                // Buffer is empty => we call tailLoad(null)
                this.rows.value = await this.tableController.tailLoad(null, pageSize) ?? []
                this.drained.value = this.rows.value.length < pageSize
                this.startIndex.value = Math.min(nextStartIndex, this.maxStartIndex.value)

            } else if (nextEndIndex > bufferLength && !this.drained.value) {

                // We needs more rows at tail
                const rowCount = nextEndIndex - bufferLength
                const newRows = await this.repeatTailLoad(tailKey, rowCount)
                this.rows.value = this.rows.value.concat(newRows)
                this.drained.value = newRows.length < rowCount
                this.startIndex.value = Math.min(nextStartIndex, this.maxStartIndex.value)

            } else {

                // We have all the rows already loaded      :)
                this.startIndex.value = nextStartIndex
                // rowBuffer.buffer.value unchanged
                // rowBuffer.drained.value unchanged

            }
        } catch {
            // this.rows unchanged
            // this.drained unchanged
            // this.startIndex unchanged
        }

        await this.tableController.bufferDidChange()
    }

    //
    // Public (clear)
    //

    public async clear(): Promise<void> {
        await this.abortCurrentTask()
        this.rows.value = []
        this.startIndex.value = 0
        this.drained.value = false
        await this.tableController.bufferDidChange()
    }


    //
    // Private
    //

    private async repeatTailLoad(tailKey: K | null, rowCount: number): Promise<R[]> {
        const limit = Math.min(rowCount, this.tableController.pageSize.value)

        let result: R[] = []
        let drained = false
        let newTailKey: K | null = tailKey
        while (result.length < rowCount && !drained) {
            const newRows = await this.tableController.tailLoad(newTailKey, limit) ?? []
            result = result.concat(newRows)
            drained = newRows.length < limit
            const newTailRow = result.length >= 1 ? result[result.length - 1] : null
            newTailKey = newTailRow !== null ? this.tableController.keyFor(newTailRow) : null
        }

        return result
    }
}
