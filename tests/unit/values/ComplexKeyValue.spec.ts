// SPDX-License-Identifier: Apache-2.0


import {describe, expect, it} from 'vitest'
import router from "@/router";
import {mount} from "@vue/test-utils";
import ComplexKeyValue from "@/components/values/ComplexKeyValue.vue";

describe("ComplexKeyValue.vue", () => {

    const COMPLEX_KEY = "0x2a880208021283020a562a54080112500a2632240a221220ef2d877b88b7464d9253560b8851316f5c2f6ddf935eb4eec0761a3262b0a48c0a2632240a221220a95d54cf49c1d08cd16d8908f37dfad95637134ffaf528a1d96da7f28d45f1390aa8012aa501080212a0010a2632240a221220c44c911fa45166e356b498463184459dd9ee760bacc083de348691d6357e06340a2632240a221220ef2d877b88b7464d9253560b8851316f5c2f6ddf935eb4eec0761a3262b0a48c0a2632240a221220a95d54cf49c1d08cd16d8908f37dfad95637134ffaf528a1d96da7f28d45f1390a2632240a221220daa5da866bf4e990c14eff4336f5ab4b416c85a31289c8cb8ae1b4a54ce8c111"

    it("props.keyBytes set with complex key", async () => {

        const wrapper = mount(ComplexKeyValue, {
            global: {
                plugins: [router]
            },
            props: {
                keyBytes: COMPLEX_KEY
            },
        });

        expect(wrapper.text()).toBe("THRESHOLD (2 of 2)THRESHOLD (1 of 2)ef2d 877b 88b7 464d 9253 560b 8851 316f 5c2f 6ddf 935e b4ee c076 1a32 62b0 a48cCopyED25519a95d 54cf 49c1 d08c d16d 8908 f37d fad9 5637 134f faf5 28a1 d96d a7f2 8d45 f139CopyED25519THRESHOLD (2 of 4)c44c 911f a451 66e3 56b4 9846 3184 459d d9ee 760b acc0 83de 3486 91d6 357e 0634CopyED25519ef2d 877b 88b7 464d 9253 560b 8851 316f 5c2f 6ddf 935e b4ee c076 1a32 62b0 a48cCopyED25519a95d 54cf 49c1 d08c d16d 8908 f37d fad9 5637 134f faf5 28a1 d96d a7f2 8d45 f139CopyED25519daa5 da86 6bf4 e990 c14e ff43 36f5 ab4b 416c 85a3 1289 c8cb 8ae1 b4a5 4ce8 c111CopyED25519")

        wrapper.unmount()
    });

    const CONTRACT_KEY = "0a0418caba02" // Contract ID: 0.0.40266

    it("props.keyBytes set with contract key", async () => {

        const wrapper = mount(ComplexKeyValue, {
            global: {
                plugins: [router]
            },
            props: {
                keyBytes: CONTRACT_KEY
            },
        });

        expect(wrapper.text()).toBe("Contract: 0.0.40266")

        wrapper.unmount()
    });


    it("props.keyBytes unset, showNone=false", async () => {

        const wrapper = mount(ComplexKeyValue, {
            global: {
                plugins: [router]
            },
            props: {},
        });

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
    });

    it("props.keyBytes unset, showNone=true", async () => {

        const wrapper = mount(ComplexKeyValue, {
            global: {
                plugins: [router]
            },
            props: {
                showNone: true
            },
        });

        expect(wrapper.text()).toBe("None")

        wrapper.unmount()
    });

})
