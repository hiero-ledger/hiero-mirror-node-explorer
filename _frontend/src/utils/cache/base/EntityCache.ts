// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, ref, watch, WatchStopHandle} from "vue";
import {Lookup} from "@/utils/cache/base/Lookup";

export abstract class EntityCache<K, E> {

    private readonly records = new Map<K, EntityRecord<E>>()

    //
    // Public
    //

    public async lookup(key: K, forceLoad = false): Promise<E> {
        let result: Promise<E>

        const currentRecord = this.records.get(key)
        if (currentRecord && (currentRecord.isFresh() || !forceLoad)) {
            result = currentRecord.promise
        } else {
            const newPromise = this.load(key)
            this.mutate(key, newPromise)
            result = newPromise
        }

        return result
    }

    public forget(key: K): void {
        this.records.delete(key)
    }

    public clear(): void {
        this.records.clear()
    }

    public makeLookup(key: Ref<K | null>, forceLoad = false): EntityLookup<K, E> {
        return new EntityLookup<K, E>(key, this, forceLoad)
    }

    public contains(key: K, forceLoad = false): boolean {
        const r = this.records.get(key)
        return r ? r.isFresh() || !forceLoad : false
    }

    public isEmpty(): boolean {
        return this.records.size == 0
    }

    //
    // Protected (to be subclassed)
    //

    protected async load(key: K): Promise<E> {
        throw new Error("Must be subclassed to load " + key)
    }

    //
    // Protected (for subclasses only)
    //

    protected mutate(key: K, promise: Promise<E>): void {
        this.records.set(key, new EntityRecord(promise))
    }
}

class EntityRecord<E> {
    readonly promise: Promise<E>
    readonly time: number

    constructor(promise: Promise<E>) {
        this.promise = promise
        this.time = Date.now()
    }

    isFresh(): boolean {
        return Date.now() - this.time < 500 // ms
    }
}

export class EntityLookup<K, E> implements Lookup<E> {

    public readonly entity: Ref<E | null> = ref(null)

    private readonly cache: EntityCache<K, E>
    private readonly key: Ref<K | null>
    private readonly forceLoad: boolean
    private readonly watchHandle: Ref<WatchStopHandle | null> = ref(null)
    private readonly loadCounter: Ref<number> = ref(0)

    constructor(key: Ref<K | null>, cache: EntityCache<K, E>, forceLoad: boolean) {
        this.key = key
        this.cache = cache
        this.forceLoad = forceLoad
    }

    public mount(): void {
        this.watchHandle.value = watch(this.key, this.keyDidChange, {immediate: true})
    }

    public unmount(): void {
        if (this.watchHandle.value !== null) {
            this.watchHandle.value()
            this.watchHandle.value = null
        }
        this.entity.value = null
        this.loadCounter.value = 0
    }

    public readonly isLoaded = computed(() => this.loadCounter.value >= 1)

    private readonly keyDidChange = async () => {
        const key = this.key.value
        if (key !== null) {
            try {
                let newEntity: E | null
                try {
                    newEntity = await this.cache.lookup(key, this.forceLoad)
                } catch {
                    newEntity = null
                }
                if (key === this.key.value && this.watchHandle.value !== null) {
                    this.entity.value = newEntity
                    this.loadCounter.value += 1
                } // else this.key has changed or cache was unmounted during lookup => aborts silently
            } catch {
                this.entity.value = null
                this.loadCounter.value += 1
            }
        } else {
            this.entity.value = null
        }
    }
}
