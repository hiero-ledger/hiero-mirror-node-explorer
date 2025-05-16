// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, shallowRef, ShallowRef, watch, WatchStopHandle} from "vue";
import {
    AccountBalanceTransactions,
    ContractResponse,
    TokenInfo,
    Topic,
} from "@/schemas/MirrorNodeSchemas.ts";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache.ts";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {TopicByIdCache} from "@/utils/cache/TopicByIdCache.ts";

export class EntityAnalyzer {

    private watchHandles: WatchStopHandle[] = []
    public readonly report: ShallowRef<EntityAnalyzerReport|null> = shallowRef(null)


    //
    // Public
    //

    public constructor(public readonly entityId: Ref<string | null>) {}

    public mount(): void {
        this.watchHandles = [
            watch(this.entityId, this.analyze, {immediate: true}),
        ]
    }

    public unmount(): void {
        for (const wh of this.watchHandles) wh()
        this.watchHandles = []
        this.report.value = null
    }

    public readonly entityType = computed(() => this.report.value?.entityType ?? null)

    //
    // Private
    //

    private readonly analyze = async () => {
        if (this.entityId.value !== null) {

            const infos = await Promise.all([
                ContractByIdCache.instance.lookup(this.entityId.value),
                AccountByIdCache.instance.lookup(this.entityId.value),
                TokenInfoCache.instance.lookup(this.entityId.value),
                TopicByIdCache.instance.lookup(this.entityId.value),
            ])

            const contractInfo = infos[0]
            const accountInfo = infos[1]
            const tokenInfo = infos[2]
            const topicInfo = infos[3]

            if (contractInfo !== null) {
                this.report.value = { entityType: EntityReportType.Contract, contractInfo: contractInfo }
            } else if (accountInfo !== null) {
                this.report.value = { entityType: EntityReportType.Account, accountInfo: accountInfo }
            } else if (tokenInfo !== null) {
                this.report.value = { entityType: EntityReportType.Token, tokenInfo: tokenInfo }
            } else if (topicInfo !== null) {
                this.report.value = { entityType: EntityReportType.Topic, topicInfo: topicInfo }
            } else {
                this.report.value = { entityType: EntityReportType.NotFound }
            }

        } else {
            this.report.value = null
        }
    }

}

export enum EntityReportType {
    Account,
    Contract,
    Token,
    Topic,
    NotFound
}

export interface EntityAnalyzerReport {
    entityType: EntityReportType,
    accountInfo?: AccountBalanceTransactions,
    contractInfo?: ContractResponse,
    tokenInfo?: TokenInfo,
    topicInfo?: Topic
}
