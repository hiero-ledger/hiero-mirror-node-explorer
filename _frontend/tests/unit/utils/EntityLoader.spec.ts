// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test, vi} from 'vitest'
import {EntityLoader, EntityLoaderState} from "@/utils/loader/EntityLoader";
import {flushPromises} from "@vue/test-utils";
import {waitFor} from "@/utils/TimerUtils";

describe("EntityLoader", () => {

    test("no periodic refresh", async () => {
        vi.useFakeTimers()

        const loader = new TestLoader(0, 0)
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

        loader.mount()
        await flushPromises()
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        vi.advanceTimersToNextTimer()
        await flushPromises()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.PAUSED)

        vi.advanceTimersToNextTimer()
        await flushPromises()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.PAUSED)

        loader.unmount()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)
    })


    test("periodic refresh + automatic pause", async () => {
        vi.useFakeTimers()

        const loader = new TestLoader(100, 3)
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

        loader.mount()
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(3)
        expect(loader.entity.value).toBe("Execution 3")
        expect(loader.state.value).toBe(EntityLoaderState.PAUSED)

        loader.unmount()
        expect(loader.executionCount).toBe(3)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)
    })

    test("periodic refresh + explicit pause + explicit resume + automatic pause", async () => {
        vi.useFakeTimers()

        const loader = new TestLoader(100, 3)
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

        loader.mount()
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)


        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        loader.pause()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.PAUSED)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.PAUSED)

        loader.resume()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(3)
        expect(loader.entity.value).toBe("Execution 3")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(3)
        expect(loader.entity.value).toBe("Execution 3")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(4)
        expect(loader.entity.value).toBe("Execution 4")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(4)
        expect(loader.entity.value).toBe("Execution 4")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(5)
        expect(loader.entity.value).toBe("Execution 5")
        expect(loader.state.value).toBe(EntityLoaderState.PAUSED)

        loader.unmount()
        expect(loader.executionCount).toBe(5)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)
    })

    test("periodic refresh + unmount during sleeping", async () => {
        vi.useFakeTimers()

        const loader = new TestLoader(100, 3)
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

        loader.mount()
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)


        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        loader.unmount()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

    })

    test("periodic refresh + unmount during loading", async () => {
        vi.useFakeTimers()

        const loader = new TestLoader(100, 3)
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

        loader.mount()
        expect(loader.executionCount).toBe(0)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(1)
        expect(loader.entity.value).toBe("Execution 1")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.SLEEPING)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe("Execution 2")
        expect(loader.state.value).toBe(EntityLoaderState.LOADING)

        loader.unmount()
        expect(loader.executionCount).toBe(2)
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)

        await vi.advanceTimersToNextTimerAsync()
        expect(loader.executionCount).toBe(3) // OK because TestLoader.load() did run until its end
        expect(loader.entity.value).toBe(null)
        expect(loader.state.value).toBe(EntityLoaderState.UNMOUNTED)
    })
})


class TestLoader extends EntityLoader<string> {

    public executionCount = 0

    //
    // EntityLoaderV2
    //

    constructor(refreshPeriod: number, maxRefreshCount: number) {
        super(refreshPeriod, maxRefreshCount)
    }

    protected async load(): Promise<string | null> {
        await waitFor(1000)
        this.executionCount += 1
        return "Execution " + this.executionCount
    }

}
