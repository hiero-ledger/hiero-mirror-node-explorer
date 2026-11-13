// SPDX-License-Identifier: Apache-2.0

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import {defineComponent, h} from "vue";
import CopyIconButton from "@/elements/CopyIconButton.vue";

describe("CopyIconButton.vue", () => {

    let writeText: ReturnType<typeof vi.fn>

    beforeEach(() => {
        writeText = vi.fn().mockResolvedValue(undefined)
        Object.defineProperty(navigator, "clipboard", {
            value: {writeText},
            configurable: true
        })
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("renders nothing when contentToCopy is unset", async () => {

        const wrapper = mount(CopyIconButton)
        await flushPromises()

        expect(wrapper.find("button").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
    });

    it("copies contentToCopy to the clipboard and shows feedback", async () => {

        vi.useFakeTimers()
        const wrapper = mount(CopyIconButton, {
            props: {
                contentToCopy: "0.0.42"
            }
        })
        await flushPromises()

        const button = wrapper.get("button")
        expect(button.attributes("aria-label")).toBe("Copy 0.0.42")
        expect(button.attributes("title")).toBe("Copy")

        await button.trigger("click")
        await flushPromises()

        expect(writeText).toHaveBeenCalledWith("0.0.42")
        expect(wrapper.emitted("copyMade")).toHaveLength(1)
        expect(button.attributes("title")).toBe("Copied")

        vi.advanceTimersByTime(1500)
        await flushPromises()
        expect(button.attributes("title")).toBe("Copy")

        wrapper.unmount()
        await flushPromises()
    });

    it("does not propagate the click to the enclosing element (e.g. a table row)", async () => {

        const parentClick = vi.fn()
        const Parent = defineComponent({
            render: () => h("div", {onClick: parentClick}, [
                h(CopyIconButton, {contentToCopy: "0.0.42"})
            ])
        })
        const wrapper = mount(Parent)
        await flushPromises()

        await wrapper.get("button").trigger("click")
        await flushPromises()

        expect(writeText).toHaveBeenCalledWith("0.0.42")
        expect(parentClick).not.toHaveBeenCalled()

        wrapper.unmount()
        await flushPromises()
    });

});
