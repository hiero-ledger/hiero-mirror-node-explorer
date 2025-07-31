// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {computed, ComputedRef, ref, Ref} from "vue";

export class RowBuffer<R, K> {

    private readonly tableController: TableController<R, K>
    private readonly presumedRowCount: number
    private abortCounter = 0

    //
    // Public
    //

    public constructor(controller: TableController<R, K>, presumedRowCount: number) {
        this.tableController = controller
        this.presumedRowCount = presumedRowCount
    }

    public readonly rows: Ref<R[]> = ref([])

    public readonly startIndex: Ref<number> = ref(0)

    public readonly drained: Ref<boolean> = ref(false)

    public readonly shadowRowCount: Ref<number> = ref(0)

    public readonly totalRowCount: ComputedRef<number> = computed(() => {
        let result: number
        const allRowCount = this.shadowRowCount.value + this.rows.value.length
        if (this.drained.value) {
            result = +allRowCount
        } else {
            const k = Math.ceil((allRowCount + 1) / this.presumedRowCount)
            result = k * this.presumedRowCount
        }
        return result
    })

    public readonly tailKey: ComputedRef<K | null> = computed(() => {
        const bufferLength = this.rows.value.length
        const tailRow = bufferLength >= 1 ? this.rows.value[bufferLength - 1] : null
        return tailRow !== null ? this.tableController.keyFor(tailRow) : null
    })

    public readonly headKey: ComputedRef<K | null> = computed(() => {
        const bufferLength = this.rows.value.length
        const headRow = bufferLength >= 1 ? this.rows.value[0] : null
        return headRow !== null ? this.tableController.keyFor(headRow) : null
    })

    public readonly maxStartIndex: ComputedRef<number> = computed(() => {
        const pageSize = this.tableController.pageSize.value
        const pageCount = Math.floor((this.shadowRowCount.value + this.rows.value.length) / pageSize) + 1
        return Math.max(0, (pageCount - 1) * pageSize)
    })

    public computePage(): number {
        const i = this.shadowRowCount.value + this.startIndex.value
        const pageSize = this.tableController.pageSize.value
        return Math.floor(i / pageSize) + 1
    }

    public computeFirstVisibleKey(): K | null {
        const bufferLength = this.rows.value.length
        const firstRow = this.startIndex.value < bufferLength ? this.rows.value[this.startIndex.value] : null
        return firstRow !== null ? this.tableController.keyFor(firstRow) : null
    }

    public abort(): void {
        this.abortCounter += 1
    }


    //
    // Public (for testing purpose)
    //

    private executedAbortCounter = 0

    public getExecutedAbortCounter(): number {
        return this.executedAbortCounter
    }

    //
    // Public (refresh)
    //

    public async refresh(): Promise<void> {

        this.abort()
        const capturedAbortCounter = this.abortCounter

        const pageSize = this.tableController.pageSize.value
        if (this.headKey.value !== null) {
            const newRows = await this.lastLoad(this.headKey.value, pageSize)
            if (this.abortCounter == capturedAbortCounter) {
                if (newRows !== null) {
                    this.rows.value = this.concatOrReplace(newRows, this.rows.value)
                    this.startIndex.value = 0
                    // this.drained.value unchanged
                    this.shadowRowCount.value = 0
                }
            } else {
                this.executedAbortCounter += 1
            }
        } else {
            const newRows = await this.tailLoad(null, pageSize, false)
            if (this.abortCounter == capturedAbortCounter) {
                if (newRows !== null) {
                    this.rows.value = newRows
                    this.startIndex.value = 0
                    this.drained.value = newRows.length < pageSize
                    this.shadowRowCount.value = 0
                }
            } else {
                this.executedAbortCounter += 1
            }
        }

        return Promise.resolve()
    }

    //
    // Public (moveToPage)
    //

    public async moveToPage(page: number, key: K | null): Promise<void> {
        this.abort()
        const captureAbortCounter = this.abortCounter

        const pageSize = this.tableController.pageSize.value
        const nextStartIndex = (page - 1) * pageSize
        const nextEndIndex = nextStartIndex + pageSize
        const shadowRowCount = this.shadowRowCount.value
        const bufferLength = this.rows.value.length

        const headKey = this.headKey.value
        const tailKey = this.tailKey.value

        if (this.abortCounter == captureAbortCounter) {

            if (key !== null) {
                const newRows = await this.tailLoad(key, pageSize, true)
                if (this.abortCounter == captureAbortCounter) {
                    if (newRows !== null) {
                        this.rows.value = newRows
                        this.drained.value = newRows.length < pageSize
                        this.startIndex.value = 0
                        this.shadowRowCount.value = (page - 1) * pageSize
                    }
                } else {
                    this.executedAbortCounter += 1
                }

            } else if (headKey === null || tailKey === null) {

                // Buffer is empty
                const newRows = await this.tailLoad(null, pageSize, false)
                if (this.abortCounter == captureAbortCounter) {
                    if (newRows !== null) {
                        this.rows.value = this.rows.value.concat(newRows)
                        this.drained.value = newRows.length < pageSize
                        this.startIndex.value = Math.min(nextStartIndex - shadowRowCount, this.maxStartIndex.value)
                        // this.shadowRowCount.value unchanged
                    }
                } else {
                    this.executedAbortCounter += 1
                }

            } else if (nextStartIndex < shadowRowCount) {

                // We need to load rows at buffer head      :/
                const rowCount = shadowRowCount - nextStartIndex
                const newRows = await this.headLoad(headKey, rowCount)
                if (this.abortCounter == captureAbortCounter) {
                    if (newRows !== null) {
                        this.rows.value = newRows.concat(this.rows.value)
                        this.startIndex.value = 0
                        this.shadowRowCount.value -= rowCount
                        // rowBuffer.drained.value unchanged
                    }
                } else {
                    this.executedAbortCounter += 1
                }

            } else if (nextEndIndex > bufferLength + shadowRowCount && !this.drained.value) {

                // We need to load rows at buffer tail      :\
                const rowCount = nextEndIndex - bufferLength - shadowRowCount
                const newRows = await this.tailLoad(tailKey, rowCount, false)
                if (this.abortCounter == captureAbortCounter) {
                    if (newRows !== null) {
                        this.rows.value = this.rows.value.concat(newRows)
                        this.drained.value = newRows.length < rowCount
                        this.startIndex.value = Math.min(nextStartIndex - shadowRowCount, this.maxStartIndex.value)
                        // rowBuffer.shadowRowCount.value unchanged
                    }
                } else {
                    this.executedAbortCounter += 1
                }

            } else {

                // We have all the rows already loaded      :)
                this.startIndex.value = nextStartIndex - shadowRowCount
                // rowBuffer.buffer.value unchanged
                // rowBuffer.drained.value unchanged
                // rowBuffer.shadowRowCount.value unchanged

            }

        }

        return Promise.resolve()
    }

    //
    // Public (clear)
    //

    public clear(): void {
        this.rows.value = []
        this.startIndex.value = 0
        this.drained.value = false
        this.shadowRowCount.value = 0
    }


    //
    // Private (xxxLoad)
    //

    private async headLoad(key: K, rowCount: number, current: R[] = []): Promise<R[] | null> {
        let result: R[] | null

        if (rowCount >= 1) {

            const limitedCount = Math.min(this.tableController.maxLimit, rowCount)
            const remainingCount = rowCount - limitedCount
            const r = await this.tableController.load(key, KeyOperator.gt, SortOrder.ASC, limitedCount)
            if (r !== null) {
                current = r.reverse().concat(current)
                if (r.length < limitedCount) {
                    result = current
                } else {
                    const headKey = this.tableController.keyFor(r[0])
                    result = await this.headLoad(headKey, remainingCount, current)
                }
            } else {
                result = current
            }

        } else {

            result = current

        }

        return Promise.resolve(result)
    }

    private async tailLoad(key: K | null, rowCount: number, lte: boolean, current: R[] = []): Promise<R[] | null> {
        let result: R[] | null

        if (rowCount >= 1) {

            const limitedCount = Math.min(this.tableController.maxLimit, rowCount)
            const remainingCount = rowCount - limitedCount
            const operator = lte ? KeyOperator.lte : KeyOperator.lt
            const r = await this.tableController.load(key, operator, SortOrder.DESC, limitedCount)
            if (r !== null) {
                current = current.concat(r)
                if (r.length < limitedCount) {
                    result = current
                } else {
                    const tailRow = r[r.length - 1]
                    const tailKey = this.tableController.keyFor(tailRow)
                    result = await this.tailLoad(tailKey, remainingCount, false, current)
                }
            } else {
                result = null
            }

        } else {
            result = current
        }

        return Promise.resolve(result)
    }

    private async lastLoad(key: K, rowCount: number, current: R[] = []): Promise<R[] | null> {
        let result: R[] | null

        if (rowCount >= 1) {

            const limitedCount = Math.min(this.tableController.maxLimit, rowCount)
            const remainingCount = rowCount - limitedCount
            const r = await this.tableController.load(key, KeyOperator.gte, SortOrder.DESC, limitedCount)
            if (r !== null) {
                current = this.concatOrReplace(r, current)
                if (r.length < limitedCount) {
                    result = current
                } else {
                    const key = this.tableController.keyFor(r[0])
                    result = await this.headLoad(key, remainingCount, current)
                }
            } else {
                result = current
            }

        } else {

            result = current

        }

        return Promise.resolve(result)
    }

    private concatOrReplace(newRows: R[], currentRows: R[]): R[] {
        let result: R[]

        const newTailRow = newRows.length >= 1 ? newRows[newRows.length - 1] : null
        const newTailKey = newTailRow !== null ? this.tableController.keyFor(newTailRow) : null
        const currentHeadRow = currentRows.length >= 1 ? currentRows[0] : null
        const currentHeadKey = currentHeadRow ? this.tableController.keyFor(currentHeadRow) : null

        if (newTailKey !== null && newTailKey == currentHeadKey) {
            // We concat :)
            result = newRows.concat(currentRows.slice(1, currentRows.length)) // 1 to skip currentHeadKey
        } else {
            // We keep new rows only :(
            result = newRows
        }

        return result
    }


}
