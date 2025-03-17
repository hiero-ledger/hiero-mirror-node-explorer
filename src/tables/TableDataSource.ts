// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, ref, watch} from "vue";
import {AppStorage} from "@/AppStorage.ts";
import {TableController} from "@/utils/table/TableController.ts";

/*
 * TableDataSource
 */

export interface TableDataSource<R> {

    readonly pageIndex: Ref<number>                 // 1 based
    readonly pageSize: Ref<number>

    readonly rowCount: Readonly<Ref<number|null>>   // null <=> data are loading
    readonly pageRows: Readonly<Ref<R[]>>
    readonly actualPageIndex :Readonly<Ref<number>> // pageIndex !== actualPageIndex => new page is loading

    readonly vueKey: (row: R) => string
}

export function tableDataSourcePageCount<R>(dataSource: TableDataSource<R>, rowCount: number|null, pageSize: number): number|null {
    return rowCount !== null ? Math.ceil(rowCount / pageSize) : null
}

/*
 * StaticDataSource
 */

export class StaticDataSource<R> implements TableDataSource<R> {

    //
    // Public
    //

    constructor(private readonly rows: Ref<R[]|null>,
                pageSizeStorageKey: string|null,
                public readonly vueKey: (row: R) => string,
                initialPageSize: number = 15) {
        const savedPageSize = pageSizeStorageKey !== null ? AppStorage.getTablePageSize(pageSizeStorageKey) : null
        this.pageSize = ref(savedPageSize ?? initialPageSize)
        if (pageSizeStorageKey !== null) {
            watch(this.pageSize, (newValue: number) => AppStorage.setTablePageSize(pageSizeStorageKey, newValue))
        }
    }

    //
    // TableDataSource
    //

    public readonly pageIndex = ref<number>(1)

    public readonly pageSize : Ref<number>

    public readonly rowCount = computed(() => this.rows.value?.length ?? null)

    public readonly pageRows = computed(() => {
        let result: R[]
        const startIndex = (this.pageIndex.value - 1) * this.pageSize.value
        if (this.rows.value !== null && startIndex < this.rows.value.length) {
            result = this.rows.value.slice(startIndex, startIndex + this.pageSize.value)
        } else {
            result = []
        }
        return result
    })

    public readonly actualPageIndex = computed(() => this.pageIndex.value)
}


/*
 * DynamicDataSource
 */


export class DynamicDataSource<R, K> implements TableDataSource<R> {

    public constructor(private readonly tableController: TableController<R, K>) {
        this.pageIndex = ref(tableController.currentPage.value)
        this.actualPageIndex = this.pageIndex
        this.pageSize = tableController.pageSize
        this.pageRows = tableController.rows
        watch(tableController.currentPage, (newValue: number) => this.pageIndex.value = newValue)
        watch(this.pageIndex, (newValue: number) => this.tableController.onPageChange(newValue))
    }

    //
    // TableDataSource
    //

    public readonly rowCount = computed(
        () => this.tableController.bare.value ? null : this.tableController.totalRowCount.value)

    public readonly pageIndex: Ref<number>

    public readonly actualPageIndex: Ref<number>

    public readonly pageSize : Ref<number>

    public readonly pageRows: Ref<R[]>

    public readonly vueKey = (row: R) => this.tableController.stringFromKey(this.tableController.keyFor(row))
}
