// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {mount} from "@vue/test-utils";
import EthPrecompileAddress from "@/components/contract/EthPrecompileAddress.vue";
import router from "@/utils/RouteManager.ts";

describe("EthPrecompileAddress", () => {

    test("no address", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error
        const wrapper = mount(EthPrecompileAddress, {
            global: {
                plugins: [router]
            },
            props: {},
        })

        expect(wrapper.text()).toBe("None")

        await wrapper.setProps({
            showNone: false
        })
        expect(wrapper.text()).toBe("")

    })

    test("0x01 - ecRecover", async () => {

        const evmAddress = "0x0000000000000000000000000000000000000001"

        await router.push("/") // To avoid "missing required param 'network'" error
        const wrapper = mount(EthPrecompileAddress, {
            global: {
                plugins: [router]
            },
            props: {
                evmAddress: evmAddress
            },
        })

        expect(wrapper.text()).toBe("0x01Copy(ecRecover)")

        await wrapper.setProps({
            showType: true
        })
        expect(wrapper.text()).toBe("0x01Copy(ecRecover)PRECOMPILE")

    })

    test("out of range address", async () => {

        const evmAddress = "0xb5b1759836516c95df61e264ec0cfd1e62b6ae7a"

        await router.push("/") // To avoid "missing required param 'network'" error
        const wrapper = mount(EthPrecompileAddress, {
            global: {
                plugins: [router]
            },
            props: {
                evmAddress: evmAddress
            },
        })

        expect(wrapper.text()).toBe("0xb5b1759836516c95df61e264ec0cfd1e62b6ae7aCopy")

        await wrapper.setProps({
            showType: true
        })
        expect(wrapper.text()).toBe("0xb5b1759836516c95df61e264ec0cfd1e62b6ae7aCopyPRECOMPILE")

    })


})
