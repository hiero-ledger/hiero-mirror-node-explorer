// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {mount} from "@vue/test-utils"
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

/*
    https://test-utils.vuejs.org/guide/advanced/slots.html
 */

describe("DashboardCardV2.vue", () => {

    it("should have all slots empty", async () => {

        const wrapper = mount(DashboardCardV2, {});

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
    })

    it("should have all slots setup", async () => {

        const sampleTitle = "ZeTitle"
        const sampleLeftControl = "ZeLeftControl"
        const sampleRightControl = "ZeRightControl"
        const sampleMediaContent = "ZeMediaContent"
        const sampleMediaDescription = "ZeMediaDescription"
        const sampleContent = "ZeContent"
        const sampleLeftContent = "ZeLeftContent"
        const sampleRightContent = "ZeRightContent"

        const wrapper = mount(DashboardCardV2, {
            slots: {
                title: sampleTitle,
                'left-control': sampleLeftControl,
                'right-control': sampleRightControl,
                'media-content': sampleMediaContent,
                'media-description': sampleMediaDescription,
                content: sampleContent,
                'left-content': sampleLeftContent,
                'right-content': sampleRightContent,
            }
        });

        expect(wrapper.text()).toContain(sampleTitle)
        expect(wrapper.text()).toContain(sampleLeftControl)
        expect(wrapper.text()).toContain(sampleRightControl)
        expect(wrapper.text()).toContain(sampleMediaContent)
        expect(wrapper.text()).toContain(sampleMediaDescription)
        expect(wrapper.text()).toContain(sampleContent)
        expect(wrapper.text()).toContain(sampleLeftContent)
        expect(wrapper.text()).toContain(sampleRightContent)

        wrapper.unmount()
    })

    it("should be collapsible", async () => {

        const sampleTitle = "ZeTitle"
        const sampleContent = "ZeContent"

        const wrapper = mount(DashboardCardV2, {
            slots: {
                title: sampleTitle,
                content: sampleContent,
            },
            props: {
                collapsibleKey: 'ZeKey'
            },
        });

        expect(wrapper.text()).toContain(sampleTitle)
        expect(wrapper.text()).toContain(sampleContent)
        expect(wrapper.find('#collapseIcon').exists()).toBe(true)
        expect(wrapper.find('#expandIcon').exists()).toBe(false)
        wrapper.unmount()
    })

    it("should not be collapsible", async () => {

        const sampleTitle = "ZeTitle"
        const sampleContent = "ZeContent"

        const wrapper = mount(DashboardCardV2, {
            slots: {
                title: sampleTitle,
                content: sampleContent,
            },
            props: {},
        });

        expect(wrapper.text()).toContain(sampleTitle)
        expect(wrapper.text()).toContain(sampleContent)
        expect(wrapper.find('#collapseIcon').exists()).toBe(false)
        expect(wrapper.find('#expandIcon').exists()).toBe(false)
        wrapper.unmount()
    })
})

