// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import TopicMessageCell, {TopicMessageCellItem} from "@/components/topic/TopicMessageCell.vue";
import Oruga from "@oruga-ui/oruga-next";
import {SAMPLE_TOPIC_MESSAGES} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("TopicMessageCell.vue", () => {

    test("default props", async () => {

        const wrapper = mount(TopicMessageCell, {
            global: {
                plugins: [Oruga]
            },
            props: {},
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('')

        wrapper.unmount()
    })

    test("timestamp and default property", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const topicMessage = SAMPLE_TOPIC_MESSAGES.messages[0]
        const timestamp = topicMessage.consensus_timestamp

        const matcher1 = "/api/v1/topics/messages/" + timestamp
        mock.onGet(matcher1).reply(200, topicMessage);

        const wrapper = mount(TopicMessageCell, {
            global: {
                plugins: [Oruga]
            },
            props: {
                timestamp: timestamp
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('backgroundMessage')

        wrapper.unmount()
    })

    test("timestamp and property", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const topicMessage = SAMPLE_TOPIC_MESSAGES.messages[0]
        const timestamp = topicMessage.consensus_timestamp

        const matcher1 = "/api/v1/topics/messages/" + timestamp
        mock.onGet(matcher1).reply(200, topicMessage);

        const wrapper = mount(TopicMessageCell, {
            global: {
                plugins: [Oruga]
            },
            props: {
                timestamp: timestamp,
                property: TopicMessageCellItem.message
            },
        })
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe('backgroundMessage')

        await wrapper.setProps({
            property: TopicMessageCellItem.sequenceNumber
        })
        await flushPromises()

        expect(wrapper.text()).toBe(topicMessage.sequence_number.toString())

        wrapper.unmount()
    })
})

