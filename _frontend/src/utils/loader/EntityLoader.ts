// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref} from "vue";

export abstract class EntityLoader<E> {

    public static readonly HUGE_COUNT = 9999999

    private readonly entityRef: Ref<E | null> = ref(null)
    private readonly errorRef: Ref<unknown> = ref(null)
    private readonly mounted = ref(false)
    private readonly requestCount = ref(0)
    private readonly timeoutID = ref(-1)


    //
    // Public
    //

    public mount(): void {
        this.mounted.value = true
        this.resume()
    }

    public unmount(): void {
        this.pause()
        this.entityRef.value = null
        this.errorRef.value = null
        this.mounted.value = false
    }

    public pause(): void {
        this.abortLoad()
    }

    public resume(): void {
        this.requestLoad()
    }

    public readonly entity = computed(() => this.entityRef.value)

    public readonly state = computed(() => {

        /*
                 \ States flow |
            Variables          | unmounted | paused | loading | sleeping | loading | sleeping | paused | ...
            -------------------+-----------+--------+---------+----------+---------+----------+--------+ ...
            this.mounted       | false     | true   | true    | true     | true    | true     | true   | ...
            this.requestCount  | 0         | 0      | 1       | 1        | 2       | 2        | 0      | ...
            this.timeoutID     | -1        | -1     | -1      | >= 0     | -1      | >= 0     | -1     | ...
         */

        let result: EntityLoaderState
        if (this.mounted.value) {
            if (this.timeoutID.value != -1) {
                result = EntityLoaderState.SLEEPING
            } else {
                result = this.requestCount.value === 0 ? EntityLoaderState.PAUSED : EntityLoaderState.LOADING
            }
        } else {
            result = EntityLoaderState.UNMOUNTED
        }

        return result
    })

    //
    // Protected
    //

    protected constructor(
        private readonly refreshPeriod: number,
        private readonly maxRefreshCount = 10) {
    }

    //
    // Protected (to be subclassed)
    //

    protected async load(): Promise<E | null> {
        throw Error("must be subclassed")
    }

    //
    // Private
    //

    private requestLoad(): void {
        this.requestCount.value += 1
        const capturedRequestCount = this.requestCount.value
        this.load()
            .then((newEntity: E | null) => {
                this.loadDidComplete(newEntity, capturedRequestCount)
            })
            .catch((error: Error) => {
                this.loadDidFail(error, capturedRequestCount)
            })

    }

    private abortLoad(): void {
        this.requestCount.value = 0
        if (this.timeoutID.value != -1) {
            window.clearTimeout(this.timeoutID.value)
            this.timeoutID.value = -1
        }
    }

    private loadDidComplete(newResponse: E | null, captureRequestCount: number) {
        if (this.requestCount.value == captureRequestCount) {
            this.entityRef.value = newResponse ?? null
            this.errorRef.value = null
            this.concludeLoad()
        }
        // else silently exits because unmount() has been called during load
    }

    private loadDidFail(reason: unknown, captureRequestCount: number) {
        if (this.requestCount.value == captureRequestCount) {
            this.entityRef.value = null
            this.errorRef.value = reason
            this.concludeLoad()
        }
        // else silently exits because unmount() has been called during load
    }

    private concludeLoad(): void {
        if (this.requestCount.value < this.maxRefreshCount) {
            this.timeoutID.value = window.setTimeout(() => {
                this.timeoutID.value = -1
                this.requestLoad()
            }, this.refreshPeriod)
        } else {
            this.requestCount.value = 0 // Entering paused state
        }
    }
}

export enum EntityLoaderState {
    UNMOUNTED, PAUSED, LOADING, SLEEPING
}
