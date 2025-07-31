// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises} from "@vue/test-utils";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import {ref} from "vue";

describe("EntityCache.ts", () => {


    test("lookup", async () => {
        const c = new TestCache()
        expect(c.isEmpty()).toBeTruthy()

        const l1 = await c.lookup(1)
        await flushPromises()
        expect(l1.key).toBe(1)
        expect(l1.seq).toBe(0)
        expect(c.counter).toBe(1)
        expect(c.isEmpty()).toBeFalsy()

        const l2 = await c.lookup(1)
        expect(l2.key).toBe(1)
        expect(l2.seq).toBe(0)
        expect(c.counter).toBe(1)
        expect(c.isEmpty()).toBeFalsy()

        c.forget(1)
        expect(c.isEmpty()).toBeTruthy()

        const l3 = await c.lookup(1)
        expect(l3.key).toBe(1)
        expect(l3.seq).toBe(1)
        expect(c.counter).toBe(2)
        expect(c.isEmpty()).toBeFalsy()

    })

    test("makeLookup", async () => {

        const c = new TestCache()

        const key = ref<number | null>(null)
        const lookup = c.makeLookup(key)
        await flushPromises()
        expect(lookup.entity.value).toBeNull()

        lookup.mount()
        await flushPromises()
        expect(lookup.entity.value).toBeNull()

        key.value = 1
        await flushPromises()
        expect(lookup.entity.value?.key).toBe(1)
        expect(lookup.entity.value?.seq).toBe(0)
        expect(c.counter).toBe(1)

        key.value = null
        await flushPromises()
        expect(lookup.entity.value).toBeNull()

        key.value = 1
        await flushPromises()
        expect(lookup.entity.value?.key).toBe(1)
        expect(lookup.entity.value?.seq).toBe(0)
        expect(c.counter).toBe(1)

        lookup.unmount()
        await flushPromises()
        expect(lookup.entity.value).toBeNull()

        lookup.mount()
        await flushPromises()
        expect(lookup.entity.value?.key).toBe(1)
        expect(lookup.entity.value?.seq).toBe(0)
        expect(c.counter).toBe(1)

        lookup.unmount()
        await flushPromises()
        expect(lookup.entity.value).toBeNull()


    })

})

class TestCache extends EntityCache<number, TestData> {

    counter = 0

    //
    // Collector
    //

    protected load(key: number): Promise<TestData> {
        const result = new TestData(key, this.counter)
        this.counter += 1
        return Promise.resolve(result);
    }


}

class TestData {
    public readonly key: number
    public readonly seq: number

    constructor(key: number, seq: number) {
        this.key = key
        this.seq = seq
    }
}
