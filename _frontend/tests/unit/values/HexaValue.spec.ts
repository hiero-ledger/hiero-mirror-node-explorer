// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import HexaValue from "@/components/values/HexaValue.vue"

describe("HexaValue.vue", () => {

    //
    // byteString unset
    //

    it("props.byteString unset, showNone == false", async () => {

        const wrapper = mount(HexaValue);
        await flushPromises()

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
        await flushPromises()
    });

    it("props.byteString unset, showNone == true", async () => {

        const wrapper = mount(HexaValue, {
            props: {
                showNone: true
            }
        });
        await flushPromises()

        expect(wrapper.text()).toBe("None")

        wrapper.unmount()
        await flushPromises()
    });

    it("should display 'None' with a mention on the line below", async () => {

        const wrapper = mount(HexaValue, {
            props: {
                showNone: true,
                noneExtra: "This should be displayed below None"
            }
        });
        await flushPromises()

        expect(wrapper.text()).toBe("NoneThis should be displayed below None")

        wrapper.unmount()
        await flushPromises()
    });

    //
    // byteString set
    //

    const BYTE_STRING = "0102030405060708090A0B0C0D0E0F"

    it("props.byteString set", async () => {

        const wrapper = mount(HexaValue, {
            props: {
                byteString: BYTE_STRING
            }
        });
        await flushPromises()

        // console.log(wrapper.html())

        expect(wrapper.text()).toBe("0x0102030405060708090A0B0C0D0E0FCopy")

        // Lines below ...
        //
        // await wrapper.find('button').trigger('click')
        // const clipboardText = await navigator.clipboard.readText()
        // expect(clipboardText).toBe(BYTE_STRING)
        //
        // ... triggers "Cannot read properties of undefined (reading 'writeText')" exception
        // because execCommand() is not supported by vue test utils.
        // Clipboard copy must be tested in e2e tests

        wrapper.unmount()
        await flushPromises()
    });

    //
    // byteString set
    //

    it("props.byteString set (with 0x)", async () => {

        const wrapper = mount(HexaValue, {
            props: {
                byteString: "0x" + BYTE_STRING
            }
        });
        await flushPromises()

        // console.log(wrapper.html())

        expect(wrapper.text()).toBe("0x0102030405060708090A0B0C0D0E0FCopy")

        wrapper.unmount()
        await flushPromises()
    });


});
