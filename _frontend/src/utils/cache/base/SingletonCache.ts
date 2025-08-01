// SPDX-License-Identifier: Apache-2.0

import {Ref, ref} from "vue";
import {Lookup} from "@/utils/cache/base/Lookup";

export class SingletonCache<E> {

    protected promise: Promise<E> | null = null

    //
    // Public
    //

    public async lookup(): Promise<E> {
        if (this.promise === null) {
            this.promise = this.load()
        }
        return this.promise
    }

    public clear(): void {
        this.promise = null
    }

    public makeLookup(): SingletonLookup<E> {
        return new SingletonLookup(this)
    }


    //
    // Protected (to be subclassed)
    //

    protected async load(): Promise<E> {
        throw new Error("Must be subclassed")
    }
}

export class SingletonLookup<E> implements Lookup<E> {

    public readonly entity: Ref<E | null> = ref(null)

    private readonly cache: SingletonCache<E>

    constructor(cache: SingletonCache<E>) {
        this.cache = cache
    }

    public mount(): void {
        this.cache.lookup()
            .then((s: E) => this.entity.value = s)
            .catch(() => this.entity.value = null)
    }

    public unmount(): void {
        this.entity.value = null
    }
}