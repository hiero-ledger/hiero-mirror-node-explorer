// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import router from "@/utils/RouteManager.ts";
import CLPR_Messages from "@/pages/CLPR_Messages.vue";
import ClprMessageTable from "@/components/clpr/ClprMessageTable.vue";
import {ClprMessageType} from "@/schemas/MirrorNodeSchemas.ts";
import {CLPR_MOCK_CHANNELS, getClprMockMessages} from "@/components/clpr/ClprMockData.ts";

HMSF.forceUTC = true

describe("CLPR_Messages.vue", () => {

    it("Should display the messages of the first channel by default, then follow the selector", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const wrapper = mount(CLPR_Messages, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });
        await flushPromises()

        const select = wrapper.get('select[data-cy="select-channel"]')
        expect((select.element as HTMLSelectElement).value).toBe(CLPR_MOCK_CHANNELS[0].channel_id!)

        const table = wrapper.findComponent(ClprMessageTable)
        expect(table.get('thead').text()).toBe("IDTYPESENDERTARGETCONNECTORACKNOWLEDGEDRESPONSEREPLY TOTIME")
        const firstChannelRows = getClprMockMessages(CLPR_MOCK_CHANNELS[0].channel_id!)
        expect(firstChannelRows.length).toBeGreaterThan(15)
        expect(table.findAll('tbody tr').length).toBe(15) // first page
        expect(table.find('select[data-cy="select-page-size"]').exists()).toBe(true)

        await select.setValue(CLPR_MOCK_CHANNELS[1].channel_id!)
        const secondChannelRows = getClprMockMessages(CLPR_MOCK_CHANNELS[1].channel_id!)
        expect(table.findAll('tbody tr').length).toBe(secondChannelRows.length)

        await select.setValue(CLPR_MOCK_CHANNELS[0].channel_id!)
        const typeSelect = wrapper.get('select[data-cy="select-type"]')
        await typeSelect.setValue("CONTROL")
        const controlRows = getClprMockMessages(CLPR_MOCK_CHANNELS[0].channel_id!, ClprMessageType.CONTROL)
        expect(controlRows.length).toBeGreaterThan(0)
        expect(table.findAll('tbody tr').length).toBe(controlRows.length)

        wrapper.unmount()
        await flushPromises()
    });
});
