// SPDX-License-Identifier: Apache-2.0


/*
    Bookmarks
        https://test-utils.vuejs.org/api/

 */

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import {
    IPFS_IMAGE_URL,
    IPFS_METADATA_CONTENT,
    IPFS_METADATA_CONTENT_URL,
    SAMPLE_NFTS,
    SAMPLE_NONFUNGIBLE
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import NftCell, {NftCellItem} from "@/components/token/NftCell.vue";

describe("NftCell.vue", () => {

    test("no props", async () => {

        const wrapper = mount(NftCell);
        await flushPromises()

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
        await flushPromises()
    });

    test("tokenId and no serial #", async () => {

        const mock = new MockAdapter(axios as any);

        const nft = SAMPLE_NFTS.nfts[2]
        const nftId = nft.token_id

        const matcher1 = "/api/v1/tokens/" + nftId
        mock.onGet(matcher1).reply(200, SAMPLE_NONFUNGIBLE);
        const matcher4 = "api/v1/contracts/" + nftId + "/results"
        mock.onGet(matcher4).reply(200, [])
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const wrapper = mount(NftCell, {
            props: {
                tokenId: nftId
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    test("tokenId, serial # and default prop", async () => {

        const mock = new MockAdapter(axios as any);

        const nft = SAMPLE_NFTS.nfts[2]
        const nftId = nft.token_id
        const serial = nft.serial_number

        const matcher1 = "/api/v1/tokens/" + nftId
        mock.onGet(matcher1).reply(200, SAMPLE_NONFUNGIBLE);
        const matcher2 = "/api/v1/tokens/" + nftId + "/nfts/" + serial
        mock.onGet(matcher2).reply(200, nft);
        const matcher3 = "api/v1/tokens/" + nftId + "/nfts/" + serial + "/transactions"
        mock.onGet(matcher3).reply(200, [])
        const matcher4 = "api/v1/contracts/" + nftId + "/results"
        mock.onGet(matcher4).reply(200, [])
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const wrapper = mount(NftCell, {
            props: {
                tokenId: nft.token_id,
                serialNumber: serial
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(wrapper.text()).toBe(IPFS_METADATA_CONTENT.name)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    test("tokenId, serial # and various props", async () => {

        const mock = new MockAdapter(axios as any);

        const nft = SAMPLE_NFTS.nfts[2]
        const nftId = nft.token_id
        const serial = nft.serial_number

        const matcher1 = "/api/v1/tokens/" + nftId
        mock.onGet(matcher1).reply(200, SAMPLE_NONFUNGIBLE);
        const matcher2 = "/api/v1/tokens/" + nftId + "/nfts/" + serial
        mock.onGet(matcher2).reply(200, nft);
        const matcher3 = "api/v1/tokens/" + nftId + "/nfts/" + serial + "/transactions"
        mock.onGet(matcher3).reply(200, [])
        const matcher4 = "api/v1/contracts/" + nftId + "/results"
        mock.onGet(matcher4).reply(200, [])
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const wrapper = mount(NftCell, {
            props: {
                tokenId: nft.token_id,
                serialNumber: serial,
                property: NftCellItem.description
            },
        });
        await flushPromises()
        expect(wrapper.text()).toBe("This is a collection about $KARATE. $KARATE is not…")

        await wrapper.setProps({
            property: NftCellItem.creator
        })
        await flushPromises()
        expect(wrapper.text()).toBe('@Buckyoto + @JuicyUn…')

        await wrapper.setProps({
            property: NftCellItem.image
        })
        await flushPromises()
        const figure = wrapper.find('figure')
        expect(figure.exists()).toBe(true)
        expect(figure.get('img').attributes('src')).toBe(IPFS_IMAGE_URL)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });
});
