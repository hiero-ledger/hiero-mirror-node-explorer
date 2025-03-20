// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {IPFS_GATEWAY_PREFIX, IPFS_METADATA, IPFS_METADATA_CONTENT, IPFS_METADATA_CONTENT_URL,} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF.ts";
import router from "@/router";
import MetadataSection from "@/components/token/MetadataSection.vue";
import {ref} from "vue";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("MetadataSection.vue", () => {

    it("Should display metadata attributes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        // Mock axios
        const mock = new MockAdapter(axios as any)
        mock.onGet(IPFS_METADATA_CONTENT_URL).reply(200, IPFS_METADATA_CONTENT)

        const metadata = ref(IPFS_METADATA)
        const decodedMetadata = atob(IPFS_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()

        const wrapper = mount(MetadataSection, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                metadataAnalyzer: analyzer,
                collapsed: false
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.get("#raw-metadata-propertyName").text()).toBe('Raw Metadata')
        expect(wrapper.get("#raw-metadata-propertyValue").text()).toBe(metadata.value)

        expect(wrapper.get("#metadata-locationName").text()).toBe('Decoded Metadata')
        expect(wrapper.get("#metadata-locationValue").text()).toBe(decodedMetadata)

        expect(wrapper.get("#typeValue").text()).toBe(IPFS_METADATA_CONTENT.type)
        expect(wrapper.get("#imageValue").text()).toBe(IPFS_METADATA_CONTENT.image)
        expect(wrapper.get("#formatValue").text()).toBe(IPFS_METADATA_CONTENT.format)

        // attributes
        for (const attr of IPFS_METADATA_CONTENT.attributes) {
            const nameId = '#' + attr.trait_type + 'Name'
            const valueId = '#' + attr.trait_type + 'Value'
            expect(wrapper.get(nameId).text()).toBe(attr.trait_type)
            expect(wrapper.get(valueId).text()).toBe(attr.value)
        }

        mock.restore()
        wrapper.unmount()
        analyzer.unmount()
        await flushPromises()
    });

    it("Should display raw metadata property when metadata unusable", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const UNUSABLE_METADATA = '==AA'
        const metadata = ref(UNUSABLE_METADATA)
        const analyzer = new TokenMetadataAnalyzer(metadata, IPFS_GATEWAY_PREFIX)
        analyzer.mount()

        const wrapper = mount(MetadataSection, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                metadataAnalyzer: analyzer,
                collapsed: false
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.get("#raw-metadata-propertyName").text()).toBe('Raw Metadata')
        expect(wrapper.get("#raw-metadata-propertyValue").text()).toBe(UNUSABLE_METADATA)

        expect(wrapper.find("#formatValue").exists()).toBe(false)
        expect(wrapper.find("#imageValue").exists()).toBe(false)
        expect(wrapper.find("#typeValue").exists()).toBe(false)
        expect(wrapper.find("#checksumValue").exists()).toBe(false)
        expect(wrapper.find("#creatorDIDValue").exists()).toBe(false)
        expect(wrapper.find("#propertiesValue").exists()).toBe(false)
        expect(wrapper.text()).not.contains('Attributes')
        expect(wrapper.text()).not.contains('Files')

        wrapper.unmount()
        analyzer.unmount()
        await flushPromises()
    });
});
