// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import {TopicMessage, TopicMessagesResponse} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class LastTopicMessageByIdCache extends EntityCache<string, TopicMessage | null> {

    public static readonly instance = new LastTopicMessageByIdCache()

    //
    // Cache
    //

    protected async load(topicId: string): Promise<TopicMessage | null> {
        let result: Promise<TopicMessage | null>
        try {
            const url = `api/v1/topics/${topicId}/messages?limit=1&order=desc`
            const response = await axios.get<TopicMessagesResponse>(url)
            if (response.data.messages.length >= 1) {
                result = Promise.resolve(response.data.messages[0])
            } else {
                result = Promise.resolve(null)
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = Promise.resolve(null)
            } else {
                throw error
            }
        }
        return result
    }

}
