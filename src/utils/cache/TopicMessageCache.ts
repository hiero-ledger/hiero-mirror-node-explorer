// SPDX-License-Identifier: Apache-2.0

import {EntityCache, EntityLookup} from "@/utils/cache/base/EntityCache";
import {TopicMessage} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";
import {computed, Ref} from "vue";

export class TopicMessageCache extends EntityCache<string, TopicMessage | null> {

    public static readonly instance = new TopicMessageCache()

    //
    // Cache
    //

    protected async load(topicIdAndSeqNumber: string): Promise<TopicMessage | null> {
        let result: Promise<TopicMessage | null>
        const idAndSeqNumberArray = topicIdAndSeqNumber.split("---")
        try {
            const url = `api/v1/topics/${idAndSeqNumberArray[0]}/messages/${idAndSeqNumberArray[1]}`
            const response = await axios.get<TopicMessage>(url)
            result = Promise.resolve(response.data)
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
