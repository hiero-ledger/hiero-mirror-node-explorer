// SPDX-License-Identifier: Apache-2.0

import {EntityID} from "@/utils/EntityID.ts";

export class HCSURI {
    protected constructor(
        public readonly version: string,
        public readonly topicId: string,
    ) {
    }

    public static parse(uri: string): HCSURI | null {
        let result: HCSURI | null
        const HCS1_REGEX = /^hcs:\/\/(\d+)\/(.+)$/;
        const match = uri.match(HCS1_REGEX)
        if (match) {
            const topicId = EntityID.parse(match[2])?.toString()
            if (topicId) {
                result = new HCSURI(match[1], topicId)
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    }

}
