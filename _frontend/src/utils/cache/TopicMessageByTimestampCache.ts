// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import {TopicMessage} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class TopicMessageByTimestampCache extends EntityCache<string, TopicMessage | null> {

    public static readonly instance = new TopicMessageByTimestampCache()

    //
    // Cache
    //

    protected async load(timestamp: string): Promise<TopicMessage | null> {
        let result: Promise<TopicMessage | null>
        try {
            const response = await axios.get<TopicMessage>("api/v1/topics/messages/" + timestamp)
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
