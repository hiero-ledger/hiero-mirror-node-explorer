// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref, watch, WatchStopHandle} from "vue"
import {NftTransactionTransfer, TokenRelationship, TransactionType,} from "@/schemas/MirrorNodeSchemas"
import {TokenRelationshipCache} from "@/utils/cache/TokenRelationshipCache"

export class NftTransactionAnalyzer {
    public readonly transaction: Ref<NftTransactionTransfer | null>
    public readonly tokenRelationships: Ref<TokenRelationship[]> = ref([])
    private readonly watchHandles: WatchStopHandle[] = []

    //
    // Public
    //

    public constructor(transaction: Ref<NftTransactionTransfer | null>) {
        this.transaction = transaction
    }

    public mount(): void {
        this.watchHandles.push(
            watch(this.transaction, this.transactionDidChange, {
                immediate: true,
            }),
        )
    }

    public unmount(): void {
        this.watchHandles.map((wh) => wh())
        this.watchHandles.splice(0)
    }

    public readonly consensusTimestamp = computed(
        () => this.transaction.value?.consensus_timestamp ?? null,
    )

    public readonly transactionType = computed(
        () => this.transaction.value?.type ?? null,
    )

    public readonly entityId = computed(
        () => this.transaction.value?.sender_account_id ?? null,
    )

    public readonly isTokenAssociation = computed(
        () => this.transactionType.value === TransactionType.TOKENASSOCIATE,
    )

    public readonly tokens = computed(() => {
        const result: string[] = []
        for (const r of this.tokenRelationships.value) {
            if (r.token_id) {
                result.push(r.token_id)
            }
        }
        return result
    })

    //
    // Private
    //

    private readonly transactionDidChange = async () => {
        if (this.transaction.value !== null) {
            if (
                this.isTokenAssociation.value &&
                this.consensusTimestamp.value !== null &&
                this.entityId.value !== null
            ) {
                const r = await TokenRelationshipCache.instance.lookup(
                    this.entityId.value,
                )
                this.tokenRelationships.value = this.filterTokenRelationships(
                    r ?? [],
                    this.consensusTimestamp.value,
                )
            } else {
                this.tokenRelationships.value = []
            }
        } else {
            this.tokenRelationships.value = []
        }
    }

    private filterTokenRelationships(
        relationships: TokenRelationship[],
        createdTimestamp: string,
    ): TokenRelationship[] {
        const result: TokenRelationship[] = []
        for (const r of relationships) {
            if (r.created_timestamp === createdTimestamp && r.token_id) {
                result.push(r)
            }
        }
        return result
    }
}
