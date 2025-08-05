// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import NftCell, {NftCellItem} from "@/components/token/NftCell.vue";
import Oruga from "@oruga-ui/oruga-next";
import {IPFS_IMAGE_URL, IPFS_METADATA_CONTENT, IPFS_METADATA_CONTENT_URL, SAMPLE_NFTS} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("NftCell.vue", () => {

    test("default props", async () => {

        const wrapper = mount(NftCell, {
            global: {
                plugins: [Oruga]
            },
            props: {},
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('')
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })

    test("tokenId and no serialNumber", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const nft = SAMPLE_NFTS.nfts[2]
        const nftId = nft.token_id
        const serial = nft.serial_number

        const matcher1 = "/api/v1/tokens/" + nftId + "/nfts/" + serial
        mock.onGet(matcher1).reply(200, nft);
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const wrapper = mount(NftCell, {
            global: {
                plugins: [Oruga]
            },
            props: {
                tokenId: nftId
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('')
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })

    test("tokenId and serialNumber", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const nft = SAMPLE_NFTS.nfts[2]
        const nftId = nft.token_id
        const serial = nft.serial_number
        const nftName = IPFS_METADATA_CONTENT.name

        const matcher1 = "/api/v1/tokens/" + nftId + "/nfts/" + serial
        mock.onGet(matcher1).reply(200, nft);
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const wrapper = mount(NftCell, {
            global: {
                plugins: [Oruga]
            },
            props: {
                tokenId: nftId,
                serialNumber: serial
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe(nftName)
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })

    test("tokenId, serialNumber and property", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const nft = SAMPLE_NFTS.nfts[2]
        const nftId = nft.token_id
        const serial = nft.serial_number
        const name = IPFS_METADATA_CONTENT.name
        const description = "This is a collection about $KARATE. $KARATE is not…"
        const creator = "@Buckyoto + @JuicyUn…"

        const matcher1 = "/api/v1/tokens/" + nftId + "/nfts/" + serial
        mock.onGet(matcher1).reply(200, nft);
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const wrapper = mount(NftCell, {
            global: {
                plugins: [Oruga]
            },
            props: {
                tokenId: nftId,
                serialNumber: serial,
                property: NftCellItem.name
            },
        })
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe(name)
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        await wrapper.setProps({
            property: NftCellItem.description
        })
        await flushPromises()

        expect(wrapper.text()).toBe(description)
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        await wrapper.setProps({
            property: NftCellItem.creator
        })
        await flushPromises()

        expect(wrapper.text()).toBe(creator)
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.find('video').exists()).toBe(false)

        await wrapper.setProps({
            property: NftCellItem.image
        })
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('NFT')
        const image = wrapper.find('img')
        expect(image.exists()).toBe(true)
        expect(image.attributes('src')).toBe(IPFS_IMAGE_URL)
        expect(image.attributes('class')).toContain('invisible-element')
        expect(wrapper.find('video').exists()).toBe(false)

        wrapper.unmount()
    })
})

