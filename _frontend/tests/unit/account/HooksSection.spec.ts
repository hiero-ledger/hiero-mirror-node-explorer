// SPDX-License-Identifier: Apache-2.0

import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest'
import {flushPromises, mount, VueWrapper} from "@vue/test-utils"
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Tabs from "@/components/Tabs.vue";
import {HMSF} from "@/utils/HMSF.ts";
import router from "@/utils/RouteManager.ts";
import HooksSection from "@/components/hooks/HooksSection.vue";
import HookEntry from "@/components/hooks/HookEntry.vue";
import {ExtensionPoint, HookType, KeyType} from "@/schemas/MirrorNodeSchemas.ts";

HMSF.forceUTC = true

describe("HooksSection.vue", () => {

    const firstAccountId = '0.0.2'
    const firstHookId = 2
    const secondHookId = 5
    let mock: MockAdapter
    const mockHooks = [
        {
            admin_key: {
                _type: KeyType.ED25519,
                key: "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"
            },
            contract_id: "0.0.1002",
            created_timestamp: "1586567700.453054000",
            deleted: false,
            extension_point: ExtensionPoint.ACCOUNT_ALLOWANCE_HOOK,
            hook_id: 2,
            owner_id: "0.0.2",
            timestamp_range: {
                from: "1586567700.453054000",
                to: "1586567700.453054000"
            },
            type: HookType.EVM
        },
        {
            admin_key: {
                _type: KeyType.ED25519,
                key: "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"
            },
            contract_id: "0.0.1005",
            created_timestamp: "1586587700.453054000",
            deleted: false,
            extension_point: ExtensionPoint.ACCOUNT_ALLOWANCE_HOOK,
            hook_id: 5,
            owner_id: "0.0.2",
            timestamp_range: {
                from: "1586587700.453054000",
                to: "1586587700.453054000"
            },
            type: HookType.EVM
        }
    ]
    const mockStorage = [
        {
            key: "0x00000000000000000000000000000000000000000000000000000000000f9a17",
            value: "0x00000000000000000000000000000000000000000000000000000000000f9a17",
            timestamp: "1586567700.453054000"
        },
        {
            key: "0x00000000000000000000000000000000000000000000000000000000000fba17",
            value: "0x00000000000000000000000000000000000000000000000000000000000fba17",
            timestamp: "1586568700.453054000"
        }
    ]

    vi.stubEnv('VITE_APP_ACTIVATE_HIP_1195', 'true')

    beforeEach(async () => {
        mock = new MockAdapter(axios as any)
        const matcher1 = `/api/v1/accounts/${firstAccountId}/hooks`
        mock.onGet(matcher1).reply(200, {hooks: mockHooks, links: {next: null}})
        const matcher2 = `/api/v1/accounts/${firstAccountId}/hooks/${firstHookId}/storage`
        mock.onGet(matcher2).reply(200, {storage: mockStorage, links: {next: null}})
        const matcher3 = `/api/v1/accounts/${firstAccountId}/hooks/${secondHookId}/storage`
        mock.onGet(matcher3).reply(200, {storage: [], links: {next: null}})
    })

    afterEach(() => {
        mock.restore()
    })

    test("Tabs are present", async () => {

        const wrapper = mount(HooksSection, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: firstAccountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const hooksSection = wrapper.find("#hooksSection")
        expect(hooksSection.exists()).toBe(true)

        const tab = hooksSection.findComponent(Tabs)
        expect(tab.exists()).toBe(true)

        const tabs = tab.findAll('li')
        expect(tabs.length).toBe(2)
        expect(tabs[0].text()).toBe('Hooks')
        expect(tabs[1].text()).toBe('Storage')

        wrapper.unmount()
        await flushPromises()
    });

    test("Content of Hooks tab", async () => {

        const wrapper = mount(HooksSection, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: firstAccountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const hooksSection = wrapper.find("#hooksSection")
        const tab = hooksSection.get('#tab-hooks')
        await tab.trigger('click')
        await flushPromises()

        const hookTable = hooksSection.get("#hooks-table")
        const hooks = hookTable.findAllComponents(HookEntry)
        expect(hooks.length).toBe(mockHooks.length)

        hooks.forEach((hook: VueWrapper, index: number) => {
            const mockHook = mockHooks[index]
            expect(hook.get('#hook-idValue').text()).toBe(mockHook.hook_id.toString())
            expect(hook.get('#hook-contract-idValue').text()).toBe(mockHook.contract_id.toString())
            expect(hook.get('#hook-owner-idValue').text()).toBe(mockHook.owner_id.toString())
            expect(hook.get('#hook-extension-pointValue').text()).toBe('Account Allowance Hook')
            expect(hook.get('#hook-typeValue').text()).toBe(mockHook.type.toString())
        })

        wrapper.unmount()
        await flushPromises()
    });

    test("Content of Storage tab with default hook selected", async () => {

        const wrapper = mount(HooksSection, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: firstAccountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const hooksSection = wrapper.find("#hooksSection")
        const tab = hooksSection.get('#tab-storage')
        await tab.trigger('click')
        await flushPromises()

        const storageTable = hooksSection.get("#hooks-storage-table")

        const select = storageTable.get('select')
        expect((select.element as HTMLSelectElement).value).toBe(firstHookId.toString())

        const slots = storageTable.findAll('tr')
        expect(slots.length).toBe(mockStorage.length + 1)

        expect(slots[0].text()).toBe('ADDRESSVALUEDATE')

        expect(slots[1].text()).toBe(
            '0000 0000 0000 0000 0000 0000 0000 0000 ' +
            '0000 0000 0000 0000 0000 0000 000f 9a17Copy' +
            '0000 0000 0000 0000 0000 0000 0000 0000 ' +
            '0000 0000 0000 0000 0000 0000 000f 9a17Copy' +
            '1:15:00.0000 AMApr 11, 2020, UTC')
        expect(slots[2].text()).toBe(
            '0000 0000 0000 0000 0000 0000 0000 0000 ' +
            '0000 0000 0000 0000 0000 0000 000f ba17Copy' +
            '0000 0000 0000 0000 0000 0000 0000 0000 ' +
            '0000 0000 0000 0000 0000 0000 000f ba17Copy' +
            '1:31:40.0000 AMApr 11, 2020, UTC')

        wrapper.unmount()
        await flushPromises()
    });

    test("Empty Storage tab with second hook selected", async () => {

        const wrapper = mount(HooksSection, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: firstAccountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const hooksSection = wrapper.find("#hooksSection")
        const tab = hooksSection.get('#tab-storage')
        await tab.trigger('click')
        await flushPromises()

        const storageTable = hooksSection.get("#hooks-storage-table")

        const select = storageTable.get('select')
        await select.setValue(secondHookId)
        await flushPromises()

        expect(storageTable.find('table').exists()).toBe(false)
        expect(storageTable.find('.empty-table').text()).toBe('This hook does not use any storage slot')

        wrapper.unmount()
        await flushPromises()
    });
});
