// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import TopicDetails from "@/pages/TopicDetails.vue";
import TopicMessageTable from "@/components/topic/TopicMessageTable.vue";
import NotificationBanner from "@/components/NotificationBanner.vue"
import {
    SAMPLE_DELETED_TOPIC,
    SAMPLE_NETWORK_CONFIG,
    SAMPLE_PUBLIC_LABELS_JSON,
    SAMPLE_PUBLIC_LABELS_URL,
    SAMPLE_TOPIC,
    SAMPLE_TOPIC_DUDE_MESSAGES,
    SAMPLE_TOPIC_MESSAGES,
    SAMPLE_TOPIC_WITH_CUSTOM_FEES
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import {fetchGetURLs} from "../MockUtils";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import FixedFeeTable from "@/components/token/FixedFeeTable.vue";
import {networkConfigKey} from "@/AppKeys.ts";
import PageHeader from "@/components/page/header/PageHeader.vue";
import router, {routeManager} from "@/utils/RouteManager.ts";
import TopicDetails_Messages from "@/pages/TopicDetails_Messages.vue";
import TopicDetails_Others from "@/pages/TopicDetails_Others.vue";
import TopicFeesSection from "@/components/topic/TopicFeesSection.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TopicDetails.vue", () => {

    it("Should display topic details and messages", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const testTopic = SAMPLE_TOPIC.topic_id
        const matcher1 = "/api/v1/topics/" + testTopic
        mock.onGet(matcher1).reply(200, SAMPLE_TOPIC)
        const matcher2 = "/api/v1/topics/" + testTopic + "/messages"
        mock.onGet(matcher2).reply(200, SAMPLE_TOPIC_MESSAGES)

        //
        // TopicDetails
        //

        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: testTopic
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(wrapper.getComponent(PageHeader).text()).toMatch("Topic " + testTopic)
        expect(wrapper.findComponent(NotificationBanner).exists()).toBe(false)

        const cards = wrapper.findAllComponents(DashboardCardV2)
        expect(cards.length).toBe(1)

        const card1 = cards[0]
        expect(card1.get('#memoValue').text()).toMatch('Mirror Node acceptance test: 2024-06-04T13:31:14.587755893Z Create Topic')
        expect(card1.get('#valid-fromValue').text()).toMatch('1:32:45.8418 PMJun 4, 2024, UTC')
        expect(card1.find('#valid-untilValue').exists()).toBe(false)
        expect(card1.get('#creation-dateValue').text()).toMatch('1:31:15.0767 PMJun 4, 2024, UTC')
        expect(card1.get('#auto-renew-periodValue').text()).toMatch('92d 14h 13min 20s')
        expect(card1.get('#auto-renew-accountValue').text()).toMatch('0.0.31393')
        expect(card1.get('#admin-keyValue').text()).toMatch('0xc249a323c878f5b5e2daccda6d731e6fdc32f870228d1cd4fae559d947dbc36cCopyED25519')
        expect(card1.get('#submit-keyValue').text()).toMatch('0x8ebc7a7fa141bae14ce76669f6f91d533f3365d6a9a465741f7e6e4abbf7aaf3CopyED25519')

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/topics/" + testTopic,
            "api/v1/network/nodes",
            "api/v1/contracts/" + SAMPLE_TOPIC.auto_renew_account,
        ])

        //
        // TopicDetails_Messages
        //

        mock.resetHistory()
        const wrapper2 = mount(TopicDetails_Messages, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: testTopic
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/topics/" + testTopic + "/messages",
        ])

        const table = wrapper2.findComponent(TopicMessageTable)
        expect(table.exists()).toBe(true)
        expect(table.findAll('tr').length).toBe(3)

        //
        // TopicDetails_Others
        //

        mock.resetHistory()
        const wrapper3 = mount(TopicDetails_Others, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: testTopic
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([])

        expect(wrapper3.findComponent(TopicFeesSection).exists()).toBe(false)

        mock.restore()
        wrapper.unmount()
        wrapper2.unmount()
        wrapper3.unmount()
        await flushPromises()
    });

    it("Should display topic details with custom fees", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const testTopic = SAMPLE_TOPIC_WITH_CUSTOM_FEES
        const topicId = testTopic.topic_id
        const matcher1 = "/api/v1/topics/" + topicId
        mock.onGet(matcher1).reply(200, testTopic)

        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: topicId
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/topics/" + SAMPLE_TOPIC_WITH_CUSTOM_FEES.topic_id,
            "api/v1/network/nodes",
            "api/v1/contracts/0.0.4736212",
        ])

        expect(wrapper.get('#memoValue').text()).toMatch('None')
        expect(wrapper.get('#fee-schedule-keyValue').text()).toMatch('0x021ef47310b559d5b6502239e021acc618a55f96f03b6664eb22e36583e4063a7d' + 'Copy' + 'ECDSA_SECP256K1')

        //
        // TopicDetails_Others
        //

        mock.resetHistory()
        const wrapper2 = mount(TopicDetails_Others, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: topicId
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/tokens/0.0.5707212",
            "api/v1/tokens/0.0.5707213",
        ])

        expect(wrapper2.get('#custom-fee-created-atValue').text()).toMatch('5:46:48.0000 AMMar 12, 2025, UTC')
        expect(wrapper2.get('#fee-exempt-key-listValue').text()).toMatch(
            '0x022759f5dcaba76d2c6cad9766643fd9bb3fce2ae6eda25afdae8bbef5badb4e95' + 'Copy' + 'ECDSA_SECP256K1' +
            '0x03b6902642e758d03e35f1b9aff9048ee0448476d134478d3f02be35a6c639b3ed' + 'Copy' + 'ECDSA_SECP256K1'
        )

        const table = wrapper2.findComponent(FixedFeeTable)
        expect(table.exists()).toBe(true)
        const rows = table.findAll('tr')
        expect(rows.length).toBe(3)
        expect (rows[0].text()).toMatch("FIXED FEE FEE CURRENCY COLLECTOR ACCOUNT")
        expect (rows[1].text()).toMatch("3" + "0.0.5707212" + "?" + "0.0.4736212")
        expect (rows[2].text()).toMatch("4" + "0.0.5707213" + "?" + "0.0.4736212")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should update when topic id changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const testTopic1 = SAMPLE_TOPIC_MESSAGES.messages[0].topic_id
        let matcher = "/api/v1/topics/" + testTopic1 + "/messages"
        mock.onGet(matcher).reply(200, SAMPLE_TOPIC_MESSAGES)

        const wrapper = mount(TopicDetails_Messages, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: testTopic1
            },
        });
        await flushPromises()

        expect(wrapper.findComponent(TopicMessageTable).find('tbody').findAll('tr')[0].text())
            .toBe("66:06:30.0653 PMJan 13, 2022, UTCbackgroundMessage")

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/topics/" + testTopic1,
            "api/v1/topics/" + testTopic1 + "/messages",
        ])

        const testTopic2 = SAMPLE_TOPIC_DUDE_MESSAGES.messages[0].topic_id
        matcher = "/api/v1/topics/" + testTopic2 + "/messages"
        mock.onGet(matcher).reply(200, SAMPLE_TOPIC_DUDE_MESSAGES)

        await wrapper.setProps({
            topicId: testTopic2
        })
        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.findComponent(TopicMessageTable).find('tbody').findAll('tr')[0].text())
            .toBe("16:05:45.8654 PMJan 13, 2022, UTC  ~T��_New message_1")

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/topics/" + testTopic1,
            "api/v1/topics/" + testTopic1 + "/messages",
            "api/v1/topics/" + testTopic2,
            "api/v1/topics/" + testTopic2 + "/messages",
        ])

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should detect invalid topic ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const invalidTopicId = "0.0.0.1000"
        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: invalidTopicId
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.get("#notificationBanner").text()).toBe("Invalid topic ID: " + invalidTopicId)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
        ])

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should flag deleted topic", async () => {

        await router.push("/")

        const mock = new MockAdapter(axios as any);

        const testTopic = SAMPLE_DELETED_TOPIC.topic_id
        const matcher1 = "/api/v1/topics/" + testTopic
        mock.onGet(matcher1).reply(200, SAMPLE_DELETED_TOPIC)

        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                topicId: testTopic
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.getComponent(PageHeader).text()).toMatch("Topic " + testTopic)

        const banner = wrapper.get("#notificationBanner")
        expect(banner.text()).toMatch("Topic is deleted")

        const cards = wrapper.findAllComponents(DashboardCardV2)
        expect(cards.length).toBe(1)

        // fetchGetURLs()'s result varies whether test is executed indivdidually or not
        // => to be investigated
        // expect(fetchGetURLs(mock)).toStrictEqual([
        //     "api/v1/network/exchangerate",
        //     "api/v1/topics/" + testTopic,
        //     "api/v1/network/nodes",
        //     "api/v1/contracts/0.0.31393",
        // ])

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display topic details with public labels", async () => {

        await router.push("/")

        const mock = new MockAdapter(axios as any);

        const testTopic = SAMPLE_TOPIC.topic_id
        const matcher1 = "/api/v1/topics/" + testTopic
        mock.onGet(matcher1).reply(200, SAMPLE_TOPIC)

        mock.onGet(SAMPLE_PUBLIC_LABELS_URL).reply(200, SAMPLE_PUBLIC_LABELS_JSON);

        routeManager.configure(routeManager.coreConfig.value, SAMPLE_NETWORK_CONFIG) // global.provide is not enough
        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {
                    "isMediumScreen": false,
                    [networkConfigKey]: SAMPLE_NETWORK_CONFIG
                }
            },
            props: {
                topicId: testTopic
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        // fetchGetURLs()'s result varies whether test is executed indivdidually or not
        // => to be investigated
        // expect(fetchGetURLs(mock)).toStrictEqual([
        //     "api/v1/topics/" + testTopic,
        //     "https://example.com/publiclabels.json",
        //     "api/v1/network/nodes",
        //     "api/v1/contracts/0.0.31393",
        // ])

        // expect(wrapper.text()).toMatch("Sample Topic LabelPublic Label for ID 0.0.31407 [Sample Type (topic)]Sample Topic Descriptionhttps://topic-example.com")

        const LABEL_INFO = SAMPLE_PUBLIC_LABELS_JSON[3]
        expect(wrapper.text()).toMatch(
            LABEL_INFO.name
            + "Public Label for ID "
            + LABEL_INFO.entityId
            + " [" + LABEL_INFO.type + "]"
            + LABEL_INFO.description
            + LABEL_INFO.website)

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });
});
