// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref, watch} from "vue";
import {PlayPauseController} from "@/components/PlayPauseButton.vue";
import {Contract} from "@/schemas/MirrorNodeSchemas";
import axios, {AxiosError} from "axios";
import {VerifiedContractsBuffer} from "@/utils/cache/VerifiedContractsBuffer";
import {Lookup} from "@/utils/cache/base/Lookup";

export class VerifiedContractsController implements PlayPauseController {

    private contractsLookup: Lookup<VerifiedContractsBuffer>

    //
    // Public
    //

    public contracts: Ref<Contract[]> = ref([])
    public capacity = 0
    public overflow = computed(() => this.contractsLookup.entity.value?.overflow ?? false)
    public loaded = computed(() => this.contractsLookup.entity.value != null)

    public constructor(contractsLookup: Lookup<VerifiedContractsBuffer>, pageSize: Ref<number>, storageKey: string) {
        this.contractsLookup = contractsLookup
        this.pageSize = pageSize
        this.storageKey = storageKey
        watch(
            this.contractsLookup.entity,
            () => {
                this.contracts.value = this.contractsLookup.entity.value?.contracts ?? []
                this.capacity = this.contractsLookup.entity.value?.capacity ?? 0
            }
        )
    }

    public pageSize: Ref<number>
    public storageKey: string

    public readonly paginated: ComputedRef<boolean> = computed(
        () => this.contracts.value.length >= this.pageSize.value)

    public readonly showPageSizeSelector = computed(() => this.contracts.value.length > 5)

    public async mount(): Promise<void> {
        this.contractsLookup.mount()
        await this.refresh()
    }

    public unmount(): void {
        this.cancelNextRefresh()
        this.contractsLookup.unmount()
    }

    //
    // PlayPauseController
    //

    public readonly autoRefresh: ComputedRef<boolean> = computed(() => this.autoRefreshRef.value)

    public async startAutoRefresh(): Promise<void> {
        if (!this.autoRefreshRef.value) {
            this.autoRefreshRef.value = true
            this.refreshCount = 0
            await this.refresh()
        }
    }

    public stopAutoRefresh(): void {
        if (this.autoRefreshRef.value) {
            this.autoRefreshRef.value = false
            this.cancelNextRefresh()
        }
    }

    //
    // Private
    //

    private updatePeriod = 10000
    private timeoutID = -1
    private maxRefreshCount = 0
    private refreshCount = 0
    private autoRefreshRef: Ref<boolean> = ref(true)

    private async refresh(): Promise<void> {
        if (this.contractsLookup.entity.value != null) {
            await this.contractsLookup.entity.value.update().catch(this.errorHandler)
            this.contracts.value = this.contractsLookup.entity.value.contracts
        }
        this.refreshCount += 1
        if (this.refreshCount < this.maxRefreshCount) {
            this.scheduleNextRefresh()
        } else {
            this.autoRefreshRef.value = false
        }
        return Promise.resolve()
    }

    private scheduleNextRefresh(): void {
        this.timeoutID = window.setTimeout(() => this.refresh(), this.updatePeriod)
    }

    private cancelNextRefresh(): void {
        if (this.timeoutID != -1) {
            window.clearTimeout(this.timeoutID)
            this.timeoutID = -1
        }
    }

    private readonly errorHandler = (reason: unknown): void => {
        console.log("reason=" + reason)
        if (axios.isAxiosError(reason)) {
            const axiosError = reason as AxiosError
            console.log("url=" + axiosError.config?.url)
        }
    }
}
