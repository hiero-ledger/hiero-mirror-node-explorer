// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import TransactionIdValue from "@/components/values/TransactionIdValue.vue";
import {TransactionID} from "@/utils/TransactionID";

describe("TransactionIdValue.vue", () => {

    test("default props", async () => {

        const wrapper = mount(TransactionIdValue);
        await flushPromises()

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
        await flushPromises()
    })

    const tId = "0.0.4385768@1721066508.484215808"
    const tIdwithDash = "0.0.4385768-1721066508-484215808"

    test("transaction ID with at", async () => {

        const wrapper = mount(TransactionIdValue, {
            props: {
                id: tId

            },
        });
        await flushPromises()
        expect(wrapper.text()).toBe(tId)

        TransactionID.setUseAtForm(false)
        await flushPromises()
        expect(wrapper.text()).toBe(tIdwithDash)

        TransactionID.setUseAtForm(true)
        await flushPromises()
        expect(wrapper.text()).toBe(tId)

        wrapper.unmount()
        await flushPromises()
    })
})

