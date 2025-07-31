// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import TimestampValue from "@/components/values/TimestampValue.vue";
import {HMSF} from "@/utils/HMSF";

HMSF.forceUTC = true

describe("TimestampValue.vue", () => {

    //
    // timestamp undefined
    //

    test("timestamp undefined, showNone == false", async () => {

        const wrapper = mount(TimestampValue);

        await flushPromises()

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
        await flushPromises()
    })

    test("timestamp undefined, showNone == true", async () => {

        const wrapper = mount(TimestampValue, {
            props: {
                showNone: true
            },
        });

        await flushPromises()

        expect(wrapper.text()).toBe("None")

        wrapper.unmount()
        await flushPromises()
    })

    //
    // seconds
    //

    const TIMESTAMP_SECONDS = "1613954653.165071000"
    // GMT: Monday 22 February 2021 00:44:13.165
    // https://www.epochconverter.com

    const TIMESTAMP_STRING = "12:44:13.1650 AMFeb 22, 2021, UTC"

    test("timestamp expressed in seconds", async () => {

        const wrapper = mount(TimestampValue, {
            props: {
                timestamp: TIMESTAMP_SECONDS
            },
        });

        await flushPromises()

        expect(wrapper.text()).toBe(TIMESTAMP_STRING)

        wrapper.unmount()
        await flushPromises()
    })

    //
    // nanoseconds
    //

    const TIMESTAMP_NANOS = "1613954653165071000"

    test("timestamp expressed in nanoseconds", async () => {

        const wrapper = mount(TimestampValue, {
            props: {
                timestamp: TIMESTAMP_NANOS,
                nano: true
            },
        });

        await flushPromises()

        expect(wrapper.text()).toBe(TIMESTAMP_STRING)

        wrapper.unmount()
        await flushPromises()
    })

    //
    // 'Infinite' timestamp
    //

    const INFINITE_TIMESTAMP = "31556889864403199.196946953"
    const INFINITE_STRING = "Never"

    test("infinite timestamp", async () => {

        const wrapper = mount(TimestampValue, {
            props: {
                timestamp: INFINITE_TIMESTAMP
            },
        });

        await flushPromises()

        expect(wrapper.text()).toBe(INFINITE_STRING)

        wrapper.unmount()
        await flushPromises()
    })
})

