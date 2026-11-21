// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import {defineComponent, h} from "vue";
import Copyable from "@/elements/Copyable.vue";

describe("Copyable.vue", () => {

    let writeText: ReturnType<typeof vi.fn>

    beforeEach(() => {
        writeText = vi.fn().mockResolvedValue(undefined)
        Object.defineProperty(navigator, "clipboard", {
            value: {writeText},
            configurable: true
        })
    })

    it("shows a copy icon button instead of a text label", async () => {

        const wrapper = mount(Copyable, {
            props: {
                contentToCopy: "0.0.42"
            },
            slots: {
                default: "0.0.42"
            }
        })
        await flushPromises()

        expect(wrapper.text()).toBe("0.0.42")
        const button = wrapper.get("#shyCopyButton button.copy-button")
        expect(button.attributes("aria-label")).toBe("Copy")
        expect(button.attributes("title")).toBe("Copy")
        expect(button.find("svg").exists()).toBe(true)

        await button.trigger("click")
        await flushPromises()

        expect(writeText).toHaveBeenCalledWith("0.0.42")
        expect(wrapper.emitted("copyMade")).toHaveLength(1)

        wrapper.unmount()
        await flushPromises()
    });

    it("has no copy button when enableCopy is false", async () => {

        const wrapper = mount(Copyable, {
            props: {
                contentToCopy: "0.0.42",
                enableCopy: false
            },
            slots: {
                default: "0.0.42"
            }
        })
        await flushPromises()

        expect(wrapper.text()).toBe("0.0.42")
        expect(wrapper.find("button.copy-button").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
    });

    it("has no copy button when there is nothing to copy", async () => {

        const wrapper = mount(Copyable, {
            props: {
                contentToCopy: ""
            }
        })
        await flushPromises()

        expect(wrapper.find("button.copy-button").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
    });

    it("does not propagate the click to the enclosing element (e.g. a table row)", async () => {

        const parentClick = vi.fn()
        const Parent = defineComponent({
            render: () => h("div", {onClick: parentClick}, [
                h(Copyable, {contentToCopy: "0.0.42"}, () => "0.0.42")
            ])
        })
        const wrapper = mount(Parent)
        await flushPromises()

        await wrapper.get("button.copy-button").trigger("click")
        await flushPromises()

        expect(writeText).toHaveBeenCalledWith("0.0.42")
        expect(parentClick).not.toHaveBeenCalled()

        wrapper.unmount()
        await flushPromises()
    });

    it("copyOnClick: the whole content is the click target and the icon is only a hint", async () => {

        const parentClick = vi.fn()
        const Parent = defineComponent({
            render: () => h("div", {onClick: parentClick}, [
                h(Copyable, {contentToCopy: "0.0.42", copyOnClick: true}, () => h("span", {class: "content"}, "0.0.42"))
            ])
        })
        const wrapper = mount(Parent)
        await flushPromises()

        const target = wrapper.get(".copy-on-click")
        expect(target.attributes("role")).toBe("button")
        expect(target.attributes("aria-label")).toBe("Copy")
        expect(wrapper.find("button.copy-button").exists()).toBe(false)
        expect(wrapper.get("#shyCopyButton .copy-button").attributes("aria-hidden")).toBe("true")

        await wrapper.get("span.content").trigger("click")
        await flushPromises()

        expect(writeText).toHaveBeenCalledWith("0.0.42")
        expect(wrapper.findComponent(Copyable).emitted("copyMade")).toHaveLength(1)
        expect(parentClick).not.toHaveBeenCalled()

        wrapper.unmount()
        await flushPromises()
    });

    it("copyOnClick: copies with the keyboard (Enter)", async () => {

        const wrapper = mount(Copyable, {
            props: {
                contentToCopy: "0.0.42",
                copyOnClick: true
            },
            slots: {
                default: "0.0.42"
            }
        })
        await flushPromises()

        await wrapper.get(".copy-on-click").trigger("keydown", {key: "Enter"})
        await flushPromises()

        expect(writeText).toHaveBeenCalledWith("0.0.42")

        wrapper.unmount()
        await flushPromises()
    });

    it("copyOnClick is ignored when there is nothing to copy", async () => {

        const wrapper = mount(Copyable, {
            props: {
                contentToCopy: "",
                copyOnClick: true
            },
            slots: {
                default: "None"
            }
        })
        await flushPromises()

        expect(wrapper.find(".copy-on-click").exists()).toBe(false)
        await wrapper.trigger("click")
        expect(writeText).not.toHaveBeenCalled()

        wrapper.unmount()
        await flushPromises()
    });

});
