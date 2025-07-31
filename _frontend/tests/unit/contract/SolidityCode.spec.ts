// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from "vitest";
import {mount} from "@vue/test-utils";
import SolidityCode from "@/components/SolidityCode.vue";

describe("SolidityCode.vue", () => {

    it("basic", () => {

        const solidityText = "function getStrategyInstanceCount() view returns (uint256 count)"
        const wrapper = mount(SolidityCode, {
            slots: {
                "default": solidityText
            },
        })

        expect(wrapper.html()).toBe("<pre class=\"language-solidity\"><code><span class=\"token keyword\">function</span> <span class=\"token function\">getStrategyInstanceCount</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token keyword\">view</span> <span class=\"token keyword\">returns</span> <span class=\"token punctuation\">(</span><span class=\"token builtin\">uint256</span> count<span class=\"token punctuation\">)</span></code></pre>")
        expect(wrapper.text()).toBe(solidityText)
        wrapper.unmount()
    })


})
