// SPDX-License-Identifier: Apache-2.0

import {Topic} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";

export class TopicByIdCache extends EntityCache<string, Topic | null> {

    public static readonly instance = new TopicByIdCache()

    //
    // Cache
    //

    protected async load(key: string): Promise<Topic | null> {
        let result: Promise<Topic | null>
        try {
            const response = await axios.get<Topic>("api/v1/topics/" + key)
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
