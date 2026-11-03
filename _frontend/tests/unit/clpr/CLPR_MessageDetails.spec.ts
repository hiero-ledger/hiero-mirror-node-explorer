// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import router from "@/utils/RouteManager.ts";
import CLPR from "@/pages/CLPR.vue";
import CLPR_Messages from "@/pages/CLPR_Messages.vue";
import CLPR_MessageDetails from "@/pages/CLPR_MessageDetails.vue";
import {CLPR_MOCK_CHANNELS, getClprMockMessages} from "@/components/clpr/ClprMockData.ts";

HMSF.forceUTC = true

describe("CLPR_MessageDetails.vue", () => {

    it("Should navigate to the message details when clicking on a row of the Messages table", async () => {

        await router.push("/")

        const wrapper = mount(CLPR_Messages, {
            global: {plugins: [router, Oruga]},
            props: {},
        });
        await flushPromises()

        const channelId = CLPR_MOCK_CHANNELS[0].channel_id
        const firstMessage = getClprMockMessages(channelId)[0]
        await wrapper.get('tbody tr td').trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.name).toBe("CLPR_MessageDetails")
        expect(router.currentRoute.value.params.channelId).toBe(channelId)
        expect(router.currentRoute.value.params.messageId).toBe(firstMessage.message_id.toString())

        wrapper.unmount()
    });

    it("Should display the message details", async () => {

        await router.push("/")
        const channelId = CLPR_MOCK_CHANNELS[0].channel_id

        const wrapper = mount(CLPR_MessageDetails, {
            global: {plugins: [router, Oruga]},
            props: {channelId: channelId, messageId: "1244"},
        });
        await flushPromises()

        expect(wrapper.text()).toMatch(RegExp("^Message 1244"))
        expect(wrapper.get("#channelId").text()).toContain(channelId)
        expect(wrapper.get("#type").text()).toContain("DATA")
        expect(wrapper.get("#acknowledged").text()).toContain("No")
        expect(wrapper.text()).not.toContain("not found")

        wrapper.unmount()
    });

    it("Should display a notification when the message is unknown", async () => {

        await router.push("/")

        const wrapper = mount(CLPR_MessageDetails, {
            global: {plugins: [router, Oruga]},
            props: {channelId: CLPR_MOCK_CHANNELS[0].channel_id, messageId: "999999"},
        });
        await flushPromises()

        expect(wrapper.text()).toContain("not found")

        wrapper.unmount()
    });

    it("Should keep the CLPR tabs, with Messages selected, and go back to the table from the Messages tab", async () => {

        const channelId = CLPR_MOCK_CHANNELS[0].channel_id
        await router.push("/mainnet/clpr/messages/" + channelId + "/1244")

        const wrapper = mount(CLPR, {
            global: {plugins: [router, Oruga]},
            props: {},
        });
        await flushPromises()

        expect(wrapper.get("#tab-CLPR_Messages").classes()).toContain("is-active")
        expect(wrapper.text()).toContain("Message 1244")
        expect(wrapper.find("table").exists()).toBe(false)

        await wrapper.get("#tab-CLPR_Messages").trigger("click")
        await flushPromises()

        expect(router.currentRoute.value.name).toBe("CLPR_Messages")
        expect(wrapper.find("table").exists()).toBe(true)

        wrapper.unmount()
    });
});
