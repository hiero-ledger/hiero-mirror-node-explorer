// SPDX-License-Identifier: Apache-2.0

import {Schedule} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";

export class ScheduleByIdCache extends EntityCache<string, Schedule | null> {

    public static readonly instance = new ScheduleByIdCache()

    //
    // Cache
    //

    protected async load(scheduleId: string): Promise<Schedule | null> {
        let result: Promise<Schedule | null>
        try {
            const response = await axios.get<Schedule>("api/v1/schedules/" + scheduleId)
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
