// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref, watch, WatchStopHandle} from "vue";
import {TokenRelationship, Transaction, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {EntityDescriptor} from "@/utils/EntityDescriptor";
import {computeNetAmount, isSuccessfulResult, makeOperatorAccountLabel} from "@/utils/TransactionTools";
import {base64Decode, byteToHex} from "@/utils/B64Utils";
import {systemContractRegistry} from "@/schemas/SystemContractRegistry";
import {TransactionID} from "@/utils/TransactionID";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";
import {BlockByTsCache} from "@/utils/cache/BlockByTsCache";
import {TokenRelationshipCache} from "@/utils/cache/TokenRelationshipCache";
import {ContractResultByTransactionIdCache} from "@/utils/cache/ContractResultByTransactionIdCache";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache.ts";

export class TransactionAnalyzer {

    public readonly transaction: Ref<Transaction | null>
    public readonly contractId: Ref<string | null> = ref(null)
    public readonly senderAccount: Ref<string | null> = ref(null)
    public readonly blockNumber: Ref<number | null> = ref(null)
    public readonly entityDescriptor = ref(EntityDescriptor.DEFAULT_ENTITY_DESCRIPTOR)
    public readonly tokenRelationships: Ref<TokenRelationship[]> = ref([])
    public readonly outerTransaction: Ref<Transaction | null> = ref(null)
    private readonly watchHandles: WatchStopHandle[] = []

    //
    // Public
    //

    public constructor(transaction: Ref<Transaction | null>) {
        this.transaction = transaction
    }

    public mount(): void {
        this.watchHandles.push(
            watch(this.transaction, this.transactionDidChange, {immediate: true})
        )
    }

    public unmount(): void {
        this.watchHandles.map((wh) => wh())
        this.watchHandles.splice(0)
    }

    public readonly consensusTimestamp = computed(() => this.transaction.value?.consensus_timestamp ?? null)

    public readonly transactionType = computed(() => this.transaction.value?.name ?? null)

    public readonly entityId = computed(() => this.transaction.value?.entity_id ?? null)

    public readonly result: ComputedRef<string | null> = computed(
        () => this.transaction.value?.result ?? null)

    public readonly hasSucceeded: ComputedRef<boolean> = computed(
        () => this.result.value != null && isSuccessfulResult(this.result.value))

    public readonly netAmount: ComputedRef<number> = computed(
        () => this.transaction.value !== null
            ? computeNetAmount(this.transaction.value?.transfers, this.transaction.value?.charged_tx_fee)
            : 0)

    public readonly hasRewardTransfers: ComputedRef<boolean> = computed(() =>
        this.transaction.value ? this.transaction.value.staking_reward_transfers.length >= 1 : false
    )
    public readonly hasNftTransfers: ComputedRef<boolean> = computed(() =>
        this.transaction.value ? this.transaction.value.nft_transfers.length >= 1 : false
    )
    public readonly hasTokenTransfers: ComputedRef<boolean> = computed(() =>
        this.transaction.value ? this.transaction.value.token_transfers.length >= 1 : false
    )

    public readonly operatorAccount: ComputedRef<string | null> = computed(() =>
        this.transaction.value ? makeOperatorAccountLabel(this.transaction.value) : null
    )

    public readonly maxFee: ComputedRef<number> = computed(() => {
        const result = this.transaction.value?.max_fee ? Number.parseFloat(this.transaction.value?.max_fee) : 0
        return isNaN(result) ? -9999 : result
    })

    public readonly chargedFee: ComputedRef<number> = computed(
        () => this.transaction.value?.charged_tx_fee ?? 0)

    public readonly formattedTransactionId: ComputedRef<string | null> = computed(() => {
        const transaction_id = this.transaction.value?.transaction_id
        return transaction_id ? TransactionID.normalizeForDisplay(transaction_id) : null
    })

    public readonly formattedHash: ComputedRef<string | null> = computed(() => {
        const hash = this.transaction.value?.transaction_hash
        return hash ? byteToHex(base64Decode(hash)) : null
    })

    public readonly systemContract: ComputedRef<string | null> = computed(() => {
        let result: string | null
        if (this.transaction.value?.name === TransactionType.CONTRACTCALL && this.transaction.value.entity_id) {
            result = systemContractRegistry.lookup(this.transaction.value.entity_id)?.description ?? null
        } else {
            result = null
        }
        return result
    })

    public readonly isBatchTransaction = computed(
        () => this.transactionType.value === TransactionType.ATOMICBATCH)

    public readonly batchKey = computed(
        () => this.transaction.value?.batch_key ?? null)

    public readonly parentTimestamp = computed(
        () => this.transaction.value?.parent_consensus_timestamp ?? null)

    public readonly isEthereumTransaction = computed(
        () => this.transactionType.value === TransactionType.ETHEREUMTRANSACTION)

    public readonly isTokenAssociation = computed(
        () => this.transactionType.value === TransactionType.TOKENASSOCIATE)

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
            const entityId = this.transaction.value?.entity_id ?? null
            if (entityId !== null) {
                switch (this.transaction.value.name) {
                    case TransactionType.CONTRACTCALL:
                    case TransactionType.ETHEREUMTRANSACTION: {
                        const contract = await ContractByIdCache.instance.lookup(entityId)
                        this.contractId.value = contract ? entityId : null
                        const result = await ContractResultByTransactionIdCache.instance.lookup(this.transaction.value?.transaction_id)
                        const account = await AccountByAddressCache.instance.lookup(result?.from ?? '')
                        this.senderAccount.value = account?.account ?? null
                        break
                    }
                    case TransactionType.CONTRACTCREATEINSTANCE:
                    case TransactionType.CONTRACTUPDATEINSTANCE:
                    case TransactionType.CONTRACTDELETEINSTANCE:
                        this.contractId.value = entityId
                        break
                    default:
                        this.contractId.value = null
                }

                this.entityDescriptor.value = await EntityDescriptor.makeEntityDescriptor(this.transaction.value)

            } else {
                this.contractId.value = null
                this.entityDescriptor.value = EntityDescriptor.DEFAULT_ENTITY_DESCRIPTOR
            }
            const consensusTimestamp = this.transaction.value?.consensus_timestamp ?? null
            if (consensusTimestamp !== null) {
                const block = await BlockByTsCache.instance.lookup(consensusTimestamp)
                this.blockNumber.value = block?.number ?? 0
            } else {
                this.blockNumber.value = null
            }
            if (this.isTokenAssociation.value && this.consensusTimestamp.value !== null && this.entityId.value !== null) {
                const r = await TokenRelationshipCache.instance.lookup(this.entityId.value)
                this.tokenRelationships.value = this.filterTokenRelationships(r ?? [], this.consensusTimestamp.value)
            } else {
                this.tokenRelationships.value = []
            }
            if (this.batchKey.value && this.parentTimestamp.value) {
                this.outerTransaction.value = await TransactionByTsCache.instance.lookup(this.parentTimestamp.value)
            }
        } else {
            this.contractId.value = null
            this.blockNumber.value = null
            this.tokenRelationships.value = []
        }
    }

    private filterTokenRelationships(relationships: TokenRelationship[], createdTimestamp: string): TokenRelationship[] {
        const result: TokenRelationship[] = []
        for (const r of relationships) {
            if (r.created_timestamp === createdTimestamp && r.token_id) {
                result.push(r)
            }
        }
        return result
    }
}
