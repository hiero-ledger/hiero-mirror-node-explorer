// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {IPFS_METADATA_CONTENT, IPFS_METADATA_CONTENT_URL, SAMPLE_NFTS, SAMPLE_NONFUNGIBLE,} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF.ts";
import NftDetails from "@/pages/NftDetails.vue";
import router from "@/utils/RouteManager.ts";
import NftDetails_Metadata from "@/pages/NftDetails_Metadata.vue";
import NftDetails_Transactions from "@/pages/NftDetails_Transactions.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("NftDetails.vue", () => {

    it("Should display details of NFT", async () => {
        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const nft = SAMPLE_NFTS.nfts[0]
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

        //
        // NftDetails
        //
        const wrapper = mount(NftDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                tokenId: nftId,
                serialNumber: serial.toString()
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch(SAMPLE_NONFUNGIBLE.name + " (" + SAMPLE_NONFUNGIBLE.symbol + ")#2Non Fungible Token")

        const media = wrapper.get('#media-placeholder')
        expect(media.text()).toBe('Non Fungible TokenThe NFT metadata does not provide any image')

        expect(wrapper.find("#descriptionValue").exists()).toBe(false)
        expect(wrapper.get("#tokenIdValue").text()).toBe(`${SAMPLE_NONFUNGIBLE.name}(${SAMPLE_NONFUNGIBLE.token_id})`)
        expect(wrapper.get("#serialNumberValue").text()).toBe(nft.serial_number.toString())
        expect(wrapper.get("#accountIdValue").text()).toBe(nft.account_id)
        expect(wrapper.find("#creatorValue").exists()).toBe(false)
        expect(wrapper.get("#createdTimestampValue").text()).toBe('12:48:18.1407 PMMay 15, 2024, UTC')
        expect(wrapper.get("#modifiedTimeStampValue").text()).toBe('12:50:09.5045 PMMay 15, 2024, UTC')
        expect(wrapper.get("#spenderIdValue").text()).toBe('None')
        expect(wrapper.get("#delegatingSpenderValue").text()).toBe('None')

        //
        // NftDetails_Metadata
        //
        const wrapper2 = mount(NftDetails_Metadata, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                tokenId: nftId,
                serialNumber: serial.toString()
            },
        });
        await flushPromises()
        // console.log(wrapper2.html())
        // console.log(wrapper2.text())

        expect(wrapper2.get("#raw-metadata-property").text()).toBe("Raw Metadata Unusable Metadata")

        //
        // NftDetails_Transactions
        //
        const wrapper3 = mount(NftDetails_Transactions, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                tokenId: nftId,
                serialNumber: serial.toString()
            },
        });
        await flushPromises()
        // console.log(wrapper3.html())
        // console.log(wrapper3.text())

        const selectors = wrapper3.findAll("select")
        expect(selectors.length).toBe(1)
        const selector = selectors[0]
        expect(selector.text()).toBe(
            'TYPES: ALLAPPROVE ALLOWANCECANCEL AIRDROPCLAIM AIRDROPCRYPTO TRANSFERDELETE ALLOWANCETOKEN AIRDROPTOKEN BURN' +
            'TOKEN DELETETOKEN MINTTOKEN REJECTTOKEN WIPE')

        expect(wrapper3.findComponent('ContractResultsSection').exists()).toBe(false)

        mock.restore()
        wrapper.unmount()
        wrapper2.unmount()
        wrapper3.unmount()
        await flushPromises()
    });

    it("Should display NFT with image and metadata", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

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

        //
        // NftDetails / NftDetails_Summary
        //

        const wrapper = mount(NftDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                tokenId: nftId,
                serialNumber: serial.toString()
            },
        });
        await flushPromises()
        // console.log(wrapper.html())


        expect(wrapper.text()).toMatch(RegExp('Non Fungible Token'))

        const media = wrapper.get('#image-content')
        expect(media.find('img').exists()).toBe(true)

        expect(wrapper.find("#nameValue").text()).toBe(IPFS_METADATA_CONTENT.name)
        expect(wrapper.find("#descriptionValue").text()).toBe(IPFS_METADATA_CONTENT.description)
        expect(wrapper.get("#tokenIdValue").text()).toBe(`${SAMPLE_NONFUNGIBLE.name}(${SAMPLE_NONFUNGIBLE.token_id})`)
        expect(wrapper.get("#serialNumberValue").text()).toBe(nft.serial_number.toString())
        expect(wrapper.get("#accountIdValue").text()).toBe(nft.account_id)
        expect(wrapper.find("#creatorValue").text()).toBe(IPFS_METADATA_CONTENT.creator)

        //
        // NftDetails_Metadata
        //

        const wrapper2 = mount(NftDetails_Metadata, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                tokenId: nftId,
                serialNumber: serial.toString()
            },
        });
        await flushPromises()
        // console.log(wrapper2.html())

        expect(wrapper2.find('#metadata-section').exists()).toBe(true)
        const metadata = wrapper2.get('#metadata-section')
        expect(metadata.get("#raw-metadata-propertyValue").text()).toBe('aXBmczovL1FtUEo4Z20xSDhWN2JvUkdSYld2clpaMUpDMnlxc2ozaGJCSnlCYUxQZ0huUTg=')
        expect(metadata.get("#metadata-locationValue").text()).toBe('ipfs://QmPJ8gm1H8V7boRGRbWvrZZ1JC2yqsj3hbBJyBaLPgHnQ8')
        expect(metadata.get("#formatValue").text()).toBe('HIP412@2.0.0')
        expect(metadata.get("#imageValue").text()).toBe('ipfs://QmXhGcYgJPgVmdDzkUuiK1RVy6fW7NVaJLLxir2iKLKRZU/0292-Shrak.png')
        expect(metadata.get("#typeValue").text()).toBe('image/png')

        mock.restore()
        wrapper.unmount()
        wrapper2.unmount()
        await flushPromises()

    });
});
