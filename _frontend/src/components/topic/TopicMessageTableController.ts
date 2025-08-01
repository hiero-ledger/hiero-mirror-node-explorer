// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController"
import {TopicMessage, TopicMessagesResponse} from "@/schemas/MirrorNodeSchemas"
import axios, {AxiosResponse} from "axios"
import {ComputedRef} from "vue"
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class TopicMessageTableController extends TableController<TopicMessage, string> {

    public readonly topicId: ComputedRef<string | null>

    //
    // Public
    //

    public constructor(router: Router, topicId: ComputedRef<string | null>, defaultPageSize: number) {
        super(
            router,
            defaultPageSize,
            TableController.FAST_REFRESH_PERIOD,
            TableController.FAST_REFRESH_COUNT,
            100,
            AppStorage.TOPIC_MESSAGE_TABLE_PAGE_SIZE_KEY
        );
        this.topicId = topicId
        this.watchAndReload([this.topicId, this.pageSize])
    }

    //
    // TableController
    //

    public async load(consensusTimestamp: string | null, operator: KeyOperator, order: SortOrder, limit: number): Promise<TopicMessage[] | null> {
        let result: Promise<TopicMessage[] | null>
        if (this.topicId.value !== null) {
            const params = {} as {
                limit: number
                timestamp: string | undefined
                order: string
            }
            params.limit = limit
            params.order = order
            if (consensusTimestamp != null) {
                params.timestamp = operator + ":" + consensusTimestamp
            }
            const cb = (r: AxiosResponse<TopicMessagesResponse>): Promise<TopicMessage[] | null> => {
                return Promise.resolve(r.data.messages ?? [])
            }
            result = axios.get<TopicMessagesResponse>(
                "api/v1/topics/" + this.topicId.value + "/messages", {params: params}).then(cb)
        } else {
            result = Promise.resolve(null)
        }

        return result
    }

    public keyFor(row: TopicMessage): string {
        return row.consensus_timestamp ?? ""
    }

    public stringFromKey(timestamp: string): string {
        return timestamp
    }

    public keyFromString(s: string): string | null {
        return s
    }

}
