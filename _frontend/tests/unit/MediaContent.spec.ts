// SPDX-License-Identifier: Apache-2.0

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import MediaContent from "@/components/MediaContent.vue";

describe("MediaContent.vue", () => {

    let openSpy: ReturnType<typeof vi.spyOn>
    const assignSpy = vi.fn()

    beforeEach(() => {
        openSpy = vi.spyOn(window, "open").mockImplementation(() => null)
        assignSpy.mockClear()
        vi.stubGlobal("location", {...window.location, assign: assignSpy})
    })

    afterEach(() => {
        openSpy.mockRestore()
        vi.unstubAllGlobals()
    })

    async function clickOn(url: string | null, noAnchor = false): Promise<void> {
        const wrapper = mount(MediaContent, {
            props: {url, type: "image/png", noAnchor}
        })
        await flushPromises()
        await wrapper.find(".media-container").trigger("click")
        wrapper.unmount()
        await flushPromises()
        // The page itself must never be navigated
        expect(assignSpy).not.toHaveBeenCalled()
    }

    it("opens https URL in a new tab with noopener,noreferrer", async () => {
        await clickOn("https://example.com/image.png")
        expect(openSpy).toHaveBeenCalledTimes(1)
        expect(openSpy).toHaveBeenCalledWith("https://example.com/image.png", "_blank", "noopener,noreferrer")
    })

    it.each([
        "javascript:alert(1)",
        "JaVaScRiPt:alert(1)",
        "  javascript:alert(1)",
        "\tjavascript:alert(1)",
        "\u0001javascript:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "blob:https://example.com/1234",
        "vbscript:msgbox(1)",
        "http://example.com/image.png",
        "not a url"
    ])("does not navigate to %j", async (url) => {
        await clickOn(url)
        expect(openSpy).not.toHaveBeenCalled()
    })

    it("does not navigate when noAnchor is set", async () => {
        await clickOn("https://example.com/image.png", true)
        expect(openSpy).not.toHaveBeenCalled()
    })

    it("does not navigate when url is null", async () => {
        await clickOn(null)
        expect(openSpy).not.toHaveBeenCalled()
    })
})
