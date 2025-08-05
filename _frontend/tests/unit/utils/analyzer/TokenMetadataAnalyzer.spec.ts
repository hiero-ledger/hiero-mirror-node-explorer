// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer";
import {
    AR_CID_METADATA,
    AR_IMAGE_URL,
    AR_METADATA,
    AR_METADATA_CONTENT,
    AR_METADATA_CONTENT_URL,
    AR_SERVER_PREFIX,
    HCS_METADATA,
    HCS_METADATA_CONTENT,
    HCS_TOPIC,
    HCS_TOPIC_MESSAGES,
    HTTPS_METADATA,
    HTTPS_METADATA_CONTENT_URL,
    IPFS_CID_METADATA,
    IPFS_GATEWAY_PREFIX,
    IPFS_IMAGE_URL,
    IPFS_METADATA,
    IPFS_METADATA_CONTENT,
    IPFS_METADATA_CONTENT_URL,
    NON_STD_METADATA_CONTENT,
    TIMESTAMP,
    TIMESTAMP_METADATA,
    TIMESTAMP_METADATA_CONTENT,
    TIMESTAMP_SUBMIT_MESSAGE
} from "../../Mocks";

describe("TokenMetadataAnalyzer.spec.ts", () => {

    test("complete flow with metadata containing IPFS URL", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        // 1) new
        const metadata = ref<string>('')
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        // 2) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        // 3) Setup metadata
        metadata.value = IPFS_METADATA
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe(IPFS_METADATA)
        expect(analyzer.imageUrl.value).toBe(IPFS_IMAGE_URL)
        expect(analyzer.creator.value).toBe(IPFS_METADATA_CONTENT.creator)
        expect(analyzer.creatorDID.value).toBe(IPFS_METADATA_CONTENT.creatorDID)
        expect(analyzer.description.value).toBe(IPFS_METADATA_CONTENT.description)
        expect(analyzer.name.value).toBe(IPFS_METADATA_CONTENT.name)
        expect(analyzer.type.value).toBe(IPFS_METADATA_CONTENT.type)
        expect(analyzer.metadataContent.value).toStrictEqual(IPFS_METADATA_CONTENT)
        expect(analyzer.metadataKeys.value).toStrictEqual([
                'name',
                'creator',
                'creatorDID',
                'type',
                'description',
                'image',
                'format',
                'attributes'
            ]
        )
        expect(analyzer.metadataString.value).toBe(JSON.stringify(IPFS_METADATA_CONTENT))

        // 4) Unset metadata
        metadata.value = ''
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        // 7) Unmount
        analyzer.unmount()
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        mock.restore()
    })

    test("metadata containing IPFS CID", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const metadata = ref(IPFS_CID_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()
        await flushPromises()

        expect(analyzer.rawMetadata.value).toBe(IPFS_CID_METADATA)
        expect(analyzer.isHIP412.value).toBe(true)
        expect(analyzer.imageUrl.value).toBe(IPFS_IMAGE_URL)
        expect(analyzer.creator.value).toBe(IPFS_METADATA_CONTENT.creator)
        expect(analyzer.creatorDID.value).toBe(IPFS_METADATA_CONTENT.creatorDID)
        expect(analyzer.description.value).toBe(IPFS_METADATA_CONTENT.description)
        expect(analyzer.name.value).toBe(IPFS_METADATA_CONTENT.name)
        expect(analyzer.type.value).toBe(IPFS_METADATA_CONTENT.type)
        expect(analyzer.metadataContent.value).toStrictEqual(IPFS_METADATA_CONTENT)
        expect(analyzer.metadataKeys.value).toStrictEqual([
                'name',
                'creator',
                'creatorDID',
                'type',
                'description',
                'image',
                'format',
                'attributes'
            ]
        )
        expect(analyzer.metadataString.value).toBe(JSON.stringify(IPFS_METADATA_CONTENT))

        analyzer.unmount()
        await flushPromises()

        mock.restore()
    })

    test("complete flow with metadata containing Arweave URL", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        mock.onGet(AR_METADATA_CONTENT_URL).reply(200, AR_METADATA_CONTENT)

        // 1) new
        const metadata = ref<string>('')
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX, AR_SERVER_PREFIX)
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        // 2) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        // 3) Setup metadata
        metadata.value = AR_METADATA
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe(AR_METADATA)
        expect(analyzer.imageUrl.value).toBe(AR_IMAGE_URL)
        expect(analyzer.creator.value).toBe(AR_METADATA_CONTENT.creator)
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBe(AR_METADATA_CONTENT.description)
        expect(analyzer.name.value).toBe(AR_METADATA_CONTENT.name)
        expect(analyzer.type.value).toBe(AR_METADATA_CONTENT.type)
        expect(analyzer.metadataContent.value).toStrictEqual(AR_METADATA_CONTENT)
        expect(analyzer.metadataKeys.value).toStrictEqual([
                "name",
                "description",
                "creator",
                "CID",
                "image",
                "type",
                "format",
                "attributes",
            ]
        )
        expect(analyzer.metadataString.value).toBe(JSON.stringify(AR_METADATA_CONTENT))

        // 4) Unset metadata
        metadata.value = ''
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        // 7) Unmount
        analyzer.unmount()
        await flushPromises()
        expect(analyzer.rawMetadata.value).toBe('')
        expect(analyzer.imageUrl.value).toBeNull()
        expect(analyzer.creator.value).toBeNull()
        expect(analyzer.creatorDID.value).toBeNull()
        expect(analyzer.description.value).toBeNull()
        expect(analyzer.name.value).toBeNull()
        expect(analyzer.type.value).toBeNull()
        expect(analyzer.metadataContent.value).toBeNull()
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBeNull()

        mock.restore()
    })

    test("metadata containing Arweave CID", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        mock.onGet(AR_METADATA_CONTENT_URL).reply(200, AR_METADATA_CONTENT)

        const metadata = ref(AR_CID_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX, AR_SERVER_PREFIX)
        analyzer.mount()
        await flushPromises()

        expect(analyzer.rawMetadata.value).toBe(AR_CID_METADATA)
        expect(analyzer.isHIP412.value).toBe(true)
        expect(analyzer.imageUrl.value).toBe(AR_IMAGE_URL)
        expect(analyzer.creator.value).toBe(AR_METADATA_CONTENT.creator)
        expect(analyzer.creatorDID.value).toBe(null)
        expect(analyzer.description.value).toBe(AR_METADATA_CONTENT.description)
        expect(analyzer.name.value).toBe(AR_METADATA_CONTENT.name)
        expect(analyzer.type.value).toBe(AR_METADATA_CONTENT.type)
        expect(analyzer.metadataContent.value).toStrictEqual(AR_METADATA_CONTENT)
        expect(analyzer.metadataKeys.value).toStrictEqual([
                "name",
                "description",
                "creator",
                "CID",
                "image",
                "type",
                "format",
                "attributes",
            ]
        )
        expect(analyzer.metadataString.value).toBe(JSON.stringify(AR_METADATA_CONTENT))

        analyzer.unmount()
        await flushPromises()

        mock.restore()
    })

    test("metadata containing HTTPS URL", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        mock.onGet(HTTPS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const metadata = ref(HTTPS_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()
        await flushPromises()

        expect(analyzer.rawMetadata.value).toBe(HTTPS_METADATA)
        expect(analyzer.imageUrl.value).toBe(IPFS_IMAGE_URL)
        expect(analyzer.creator.value).toBe(IPFS_METADATA_CONTENT.creator)
        expect(analyzer.creatorDID.value).toBe(IPFS_METADATA_CONTENT.creatorDID)
        expect(analyzer.description.value).toBe(IPFS_METADATA_CONTENT.description)
        expect(analyzer.name.value).toBe(IPFS_METADATA_CONTENT.name)
        expect(analyzer.type.value).toBe(IPFS_METADATA_CONTENT.type)
        expect(analyzer.metadataContent.value).toStrictEqual(IPFS_METADATA_CONTENT)
        expect(analyzer.metadataKeys.value).toStrictEqual([
                'name',
                'creator',
                'creatorDID',
                'type',
                'description',
                'image',
                'format',
                'attributes'
            ]
        )
        expect(analyzer.metadataString.value).toBe(JSON.stringify(IPFS_METADATA_CONTENT))

        analyzer.unmount()
        await flushPromises()

        mock.restore()
    })

    // This test in disabled because the processing of HCS-1 based contents
    // involves decoding using the @bokuweb/zstd-wasm module, which currently
    // fails when run in Vitest.
    test.skip("metadata containing HCS-1 URI", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        const matcher = `api/v1/topics/${HCS_TOPIC}/messages?limit=100&order=asc`
        mock.onGet(matcher).reply(200, HCS_TOPIC_MESSAGES)

        const metadata = ref(HCS_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()
        await flushPromises()

        expect(analyzer.rawMetadata.value).toBe(HCS_METADATA)
        expect(analyzer.imageUrl.value).toBe(null)
        expect(analyzer.creator.value).toBe(null)
        expect(analyzer.creatorDID.value).toBe(null)
        expect(analyzer.description.value).toBe(null)
        expect(analyzer.name.value).toBe(null)
        expect(analyzer.type.value).toBe(null)
        expect(analyzer.metadataContent.value).toStrictEqual(HCS_METADATA_CONTENT)
        expect(analyzer.metadataKeys.value).toStrictEqual(['o', 'c'])
        expect(analyzer.metadataString.value).toBe(JSON.stringify(HCS_METADATA_CONTENT))

        analyzer.unmount()
        await flushPromises()

        mock.restore()
    })

    test("metadata containing tx timestamp", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        // const matcher = "api/v1/topics/messages/" + "1713509435.878762003"
        const matcher = "api/v1/topics/messages/" + TIMESTAMP
        mock.onGet(matcher).reply(200, TIMESTAMP_SUBMIT_MESSAGE)

        const metadata = ref(TIMESTAMP_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()
        await flushPromises()

        expect(analyzer.rawMetadata.value).toBe(TIMESTAMP_METADATA)
        expect(analyzer.imageUrl.value).toBe(IPFS_GATEWAY_PREFIX + "bafkreiabqdnzt3iy5kilfqlktvzmbwjmokkxu73662yvsivvmyxgohnbzm")
        expect(analyzer.creator.value).toBe(null)
        expect(analyzer.creatorDID.value).toBe(null)
        expect(analyzer.description.value).toBe(null)
        expect(analyzer.name.value).toBe("ibird ")
        expect(analyzer.type.value).toBe("Profile")
        expect(analyzer.metadataContent.value).toStrictEqual(TIMESTAMP_METADATA_CONTENT)
        expect(analyzer.metadataKeys.value).toStrictEqual([
                'Identifier', 'Type',
                'Author', 'Name',
                'Bio', 'Website',
                'Location', 'UserMessages',
                'Picture', 'Banner'
            ]
        )
        expect(analyzer.metadataString.value).toBe(JSON.stringify(TIMESTAMP_METADATA_CONTENT))

        analyzer.unmount()
        await flushPromises()

        mock.restore()
    })

    test("metadata containing arbitrary string", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        // const matcher = "api/v1/topics/messages/" + "1713509435.878762003"
        const matcher = "api/v1/topics/messages/" + TIMESTAMP
        mock.onGet(matcher).reply(200, TIMESTAMP_SUBMIT_MESSAGE)

        const arbitraryMetadata = btoa("/unknown-path/unavailable-image.jpg")
        const metadata = ref(arbitraryMetadata)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()
        await flushPromises()

        expect(analyzer.rawMetadata.value).toBe(arbitraryMetadata)
        expect(analyzer.imageUrl.value).toBe(null)
        expect(analyzer.creator.value).toBe(null)
        expect(analyzer.creatorDID.value).toBe(null)
        expect(analyzer.description.value).toBe(null)
        expect(analyzer.name.value).toBe(null)
        expect(analyzer.type.value).toBe(null)
        expect(analyzer.metadataContent.value).toBe(null)
        expect(analyzer.metadataKeys.value).toStrictEqual([])
        expect(analyzer.metadataString.value).toBe(null)

        analyzer.unmount()
        await flushPromises()

        mock.restore()
    })

    test("non standard metadata", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, NON_STD_METADATA_CONTENT)

        const metadata = ref(IPFS_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()
        await flushPromises()

        expect(analyzer.rawMetadata.value).toBe(IPFS_METADATA)
        expect(analyzer.isHIP412.value).toBe(false)
        expect(analyzer.imageUrl.value).toBe(IPFS_IMAGE_URL)
        expect(analyzer.metadataKeys.value).toStrictEqual([
                'custom',
                'picture'
            ]
        )
        expect(analyzer.metadataString.value).toBe(JSON.stringify(NON_STD_METADATA_CONTENT))

        analyzer.unmount()
        await flushPromises()

        mock.restore()
    })
})
