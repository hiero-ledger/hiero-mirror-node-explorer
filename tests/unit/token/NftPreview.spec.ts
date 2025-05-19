// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import NftPreview from "@/components/token/NftPreview.vue";
import Oruga from "@oruga-ui/oruga-next";

describe("NftPreview.vue", () => {

    const contentUrl = 'https://dummy.image.url'

    test("No URL and default values", async () => {

        const wrapper = mount(NftPreview, {
            global: {
                plugins: [Oruga]
            },
            props: {},
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('NFT')

        expect(wrapper.find('img').exists()).toBe(false)

        expect(wrapper.findComponent('o-tooltip').exists()).toBe(false)

        expect(wrapper.find('figure').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })

    test("No URL and custom size", async () => {

        const tooltipText = 'The NFT metadata does not provide any image'
        const wrapper = mount(NftPreview, {
            global: {
                plugins: [Oruga]
            },
            props: {
                size: 250
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('Non Fungible Token' + tooltipText)
        const hbarLogo = wrapper.find('svg')
        expect(hbarLogo.exists()).toBe(true)
        expect(hbarLogo.attributes('class')).toContain('lucide-image-off-icon')

        const tooltip = wrapper.find('#info-tooltip')
        expect(tooltip.exists()).toBe(true)
        expect(tooltip.text()).toBe(tooltipText)
        expect(tooltip.get('svg').attributes('class')).toContain('lucide-info-icon')

        expect(wrapper.find('figure').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })

    test("With URL and custom size", async () => {

        const wrapper = mount(NftPreview, {
            global: {
                plugins: [Oruga]
            },
            props: {
                url: contentUrl,
                size: 250
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('Non Fungible Token')
        const hbarLogo = wrapper.find('svg')
        expect(hbarLogo.exists()).toBe(true)
        expect(hbarLogo.attributes('class')).toContain('lucide-image-off-icon')

        expect(wrapper.findComponent('o-tooltip').exists()).toBe(false)

        const figure = wrapper.find('figure')
        expect(figure.exists()).toBe(true)
        expect(figure.get('img').attributes('src')).toBe(contentUrl)

        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })

    test("With URL, image type and custom size", async () => {

        const wrapper = mount(NftPreview, {
            global: {
                plugins: [Oruga]
            },
            props: {
                url: contentUrl,
                type: 'image/jpeg',
                size: 250
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('Non Fungible Token')
        const hbarLogo = wrapper.find('svg')
        expect(hbarLogo.exists()).toBe(true)
        expect(hbarLogo.attributes('class')).toContain('lucide-image-off-icon')

        expect(wrapper.findComponent('o-tooltip').exists()).toBe(false)

        const figure = wrapper.find('figure')
        expect(figure.exists()).toBe(true)
        expect(figure.get('img').attributes('src')).toBe(contentUrl)

        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })

    test("With URL, unsupported type and custom size", async () => {

        const wrapper = mount(NftPreview, {
            global: {
                plugins: [Oruga]
            },
            props: {
                url: contentUrl,
                type: 'foo/bar',
                size: 250
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('Non Fungible Token')
        const hbarLogo = wrapper.find('svg')
        expect(hbarLogo.exists()).toBe(true)
        expect(hbarLogo.attributes('class')).toContain('lucide-image-off-icon')

        expect(wrapper.findComponent('o-tooltip').exists()).toBe(false)

        const figure = wrapper.find('figure')
        expect(figure.exists()).toBe(true)
        expect(figure.get('img').attributes('src')).toBe(contentUrl)

        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })
})

