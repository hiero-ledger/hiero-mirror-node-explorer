// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, ref, watch, WatchStopHandle} from "vue";
import {
    AccountInfo,
    ContractResponse,
    ContractResult,
    TokenInfo,
    Transaction,
    TransactionType
} from "@/schemas/MirrorNodeSchemas.ts";
import {ContractResultByTsCache} from "@/utils/cache/ContractResultByTsCache.ts";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {EntityID} from "@/utils/EntityID.ts";

export class TransactionTypeAnalyzer {

    private readonly contractResult = ref<ContractResult|null>(null)
    private readonly contractInfo = ref<ContractResponse|null>(null)
    private readonly accountInfo = ref<AccountInfo|null>(null)
    private readonly tokenInfo = ref<TokenInfo|null>(null)
    private watchStopHandle: WatchStopHandle | null = null


    //
    // Public
    //

    public constructor(public readonly transaction: Ref<Transaction | null>) {}

    public mount(): void {
        this.watchStopHandle = watch(this.transaction, this.analyze, {immediate: true})
    }

    public unmount(): void {
        if (this.watchStopHandle !== null) {
            this.watchStopHandle()
            this.watchStopHandle = null
        }
    }

    public readonly timestamp = computed(
        () => this.transaction.value?.consensus_timestamp ?? null)

    public readonly isEthereumTransaction = computed(
        () => this.transaction.value?.name == TransactionType.ETHEREUMTRANSACTION)

    public readonly ethereumTransactionLabel = computed(() => {
        let result: string|null
        if (this.transaction.value !== null) {
            if (this.transaction.value.name == TransactionType.ETHEREUMTRANSACTION && this.contractResult.value !== null) {

                /*
                    ETHEREUM TRANSACTION EXPLORATION

                    | ContractResult.to       | Subtype              | Summary               |
                    ==========================|======================|=======================|
                    | Account                 | Eth Crypto Transfer  | from -> value -> to   |
                    |-------------------------|----------------------|-----------------------|
                    | Contract                | Eth Contract Call    | Call ABI (when avail.)|
                    |-------------------------|----------------------|-----------------------|
                    | Fungible Token          | Eth Contract Call    | ERC20 ABI (*)         |
                    |-------------------------|----------------------|-----------------------|
                    | Non Fungible Token      | Eth Contract Call    | ERC721 ABI (*)        |
                    |-------------------------|----------------------|-----------------------|
                    | null                    | Eth Contract Create  | Created Contract Id ? |

                 */

               if (this.contractResult.value.to === null) {
                    // It's a contract deployment
                    result = "CONTRACT CREATE"
                } else if (this.contractInfo.value !== null) {
                    // ContractResult.to is a contract
                    result = "CONTRACT CALL"
                } else if (this.accountInfo.value !== null) {
                    // ContractResult.to is an account
                   const amount = this.contractResult.value.amount ?? 0
                   result = amount > 0 ? "CRYPTO TRANSFER" : null
                } else if (this.tokenInfo.value !== null) {
                    // ContractResult.to is a token
                    result = "CONTRACT CALL"
                } else {
                   // ContractResult.to is bizarre
                   result = null
                }

            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    })

    //
    // Private
    //

    private readonly analyze = async () => {

        if (this.transaction.value !== null && this.transaction.value.name === TransactionType.ETHEREUMTRANSACTION) {

            this.contractResult.value = await ContractResultByTsCache.instance.lookup(this.transaction.value.consensus_timestamp)
            const to = this.contractResult.value?.to ?? null
            if (to !== null) {
                this.contractInfo.value = await ContractByAddressCache.instance.lookup(to)
                if (this.contractInfo.value === null) {
                    this.accountInfo.value = await AccountByAddressCache.instance.lookup(to)
                } else {
                    this.accountInfo.value = null
                }
                if (this.contractInfo.value === null && this.accountInfo.value === null) {
                    const candidateTokenId = EntityID.fromAddress(to)
                    if (candidateTokenId !== null) {
                        this.tokenInfo.value = await TokenInfoCache.instance.lookup(candidateTokenId.toString())
                    } else {
                        this.tokenInfo.value = null
                    }
                } else {
                    this.tokenInfo.value = null
                }

            } else {
                this.contractInfo.value = null
                this.accountInfo.value = null
                this.tokenInfo.value = null
            }
        } else {
            this.contractResult.value = null
            this.contractInfo.value = null
            this.accountInfo.value = null
            this.tokenInfo.value = null
        }
    }

}
