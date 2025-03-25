// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, watch} from "vue";
import {EntityID} from "@/utils/EntityID";
import {TransactionID} from "@/utils/TransactionID";
import {AccountAlias} from "@/utils/AccountAlias";
import {hexToByte} from "@/utils/B64Utils";
import {Timestamp} from "@/utils/Timestamp";
import {
    AccountSearchAgent,
    BlockSearchAgent,
    ContractSearchAgent,
    DomainNameSearchAgent,
    ERC20SearchAgent,
    ERC721SearchAgent,
    FullTokenNameSearchAgent,
    NarrowTokenNameSearchAgent,
    ScheduleSearchAgent,
    SearchAgent,
    TokenSearchAgent,
    TopicSearchAgent,
    TransactionSearchAgent
} from "@/components/search/SearchAgent";
import {nameServiceProviders} from "@/utils/name_service/provider/AllProviders";
import {InputChangeController} from "@/components/utils/InputChangeController.ts";
import {routeManager} from "@/router.ts";

export class SearchController {

    /*

    inputText syntax                      | Description      | Tentative searches
    =====================================+==================+======================================================
    shard.realm.num[-checksum]           | Entity ID        | api/v1/accounts/{shard.realm.num}
                                         |                  | api/v1/contracts/{shard.realm.num}
                                         |                  | api/v1/tokens/{shard.realm.num}
                                         |                  | api/v1/topics/{shard.realm.num}
                                         |                  | api/v1/schedules/{shard.realm.num}
    -------------------------------------+------------------+------------------------------------------------------
    integer[-checksum]                   | Incomplete       | api/v1/accounts/0.0.{integer}
                                         | Entity ID        | api/v1/contracts/0.0.{integer}
                                         |                  | api/v1/tokens/0.0.{integer}
                                         |                  | api/v1/topics/0.0.{integer}
                                         |                  | api/v1/schedules/0.0.{integer}
                                         |                  | api/v1/blocks/{integer}
    -------------------------------------+------------------+------------------------------------------------------
    shard.realm.num@seconds.nanoseconds  | Transaction ID   | api/v1/transactions/normalize({inputText})
    -------------------------------------+------------------+------------------------------------------------------
    shard.realm.num@seconds              | Incomplete       | api/v1/transactions/normalize({inputText}.000000000)
                                         | Transaction ID   |
    -------------------------------------+------------------+------------------------------------------------------
    shard.realm.num-seconds-nanoseconds  | Transaction ID   | api/v1/transactions/{inputText}
                                         | (normalized)     |
    -------------------------------------+------------------+------------------------------------------------------
    hexadecimal 48 bytes                 | Hedera Hash      | api/v1/transactions/{inputText}
                                         |                  | api/v1/blocks/{inputText}
    -------------------------------------+------------------+------------------------------------------------------
    hexadecimal 32 bytes                 | EVM Hash         | api/v1/contracts/results/{inputText}
                                         |                  |  + api/v1/transactions/{result.timestamp}
    -------------------------------------+------------------+------------------------------------------------------
    hexadecimal 20 bytes                 | Ethereum Address | api/v1/accounts/{inputText}
                                         |                  | api/v1/contracts/{inputText}
                                         |                  | api/v1/token/ethereumToEntityID({inputText})
    -------------------------------------+------------------+------------------------------------------------------
    hexadecimal < 20 bytes               | Incomplete       | api/v1/accounts/padded({inputText})
                                         | Ethereum Address | api/v1/contracts/padded({inputText})
                                         |                  | api/v1/token/ethereumToEntityID(padded({inputText}))
    -------------------------------------+------------------+------------------------------------------------------
    hexadecimal 32/33 bytes              | Public Key       | api/v1/accounts/?account.publickey={inputText}
    -------------------------------------+------------------+------------------------------------------------------
    hexadecimal n bytes                  | Account Alias    | api/v1/accounts/base32({inputText})
                                         | in hex form      |
    -------------------------------------+------------------+------------------------------------------------------
    base32                               | Account Alias    | api/v1/accounts/{inputText}
    -------------------------------------+------------------+------------------------------------------------------
    /\.[a-z|ℏ]+$/                        | Kabuto domain    | Kabuto API
                                         | HNS domain       | HNS API
    -------------------------------------+------------------+------------------------------------------------------

     */

    private readonly inputChangeController: InputChangeController
    private readonly accountSearchAgent = new AccountSearchAgent()
    private readonly contractSearchAgent = new ContractSearchAgent()
    private readonly tokenSearchAgent = new TokenSearchAgent()
    private readonly topicSearchAgent = new TopicSearchAgent()
    private readonly scheduleSearchAgent = new ScheduleSearchAgent()
    private readonly transactionSearchAgent = new TransactionSearchAgent()
    private readonly blockSearchAgent = new BlockSearchAgent()
    private readonly narrowTokenNameSearchAgent = new NarrowTokenNameSearchAgent()
    public readonly fullTokenNameSearchAgent = new FullTokenNameSearchAgent()
    public readonly erc20SearchAgent = new ERC20SearchAgent()
    public readonly erc721SearchAgent = new ERC721SearchAgent()

    private readonly allAgents: SearchAgent<unknown, unknown>[] = []
    public readonly domainNameSearchAgents: DomainNameSearchAgent[] = []

    //
    // Public
    //

    public constructor(public readonly inputText: Ref<string>) {
        this.inputChangeController = new InputChangeController(inputText)
        this.allAgents.push(
            this.narrowTokenNameSearchAgent,
            this.fullTokenNameSearchAgent,
            this.contractSearchAgent,
            this.accountSearchAgent,
            this.tokenSearchAgent,
            this.topicSearchAgent,
            this.scheduleSearchAgent,
            this.transactionSearchAgent,
            this.blockSearchAgent,
            this.erc20SearchAgent,
            this.erc721SearchAgent,
        )
        for (const p of nameServiceProviders) {
            const a = new DomainNameSearchAgent(p)
            this.domainNameSearchAgents.push(a)
            this.allAgents.push(a)
        }
        watch(this.actualInputText, this.actualInputTextDidChange)
    }

    public readonly visible = computed(
        () => this.actualInputText.value !== "")

    public readonly actualInputText = computed(
        () => this.inputChangeController.outputText.value)

    public readonly loading = computed(() => {
        let result = false
        for (const a of this.allAgents) {
            if (a.loading.value) {
                result = true
                break
            }
        }
        return result
    })

    public readonly visibleAgents = computed(() => {
        const result: SearchAgent<unknown, unknown>[] = []
        for (const a of this.allAgents) {
            if (a.candidates.value.length >= 1) {
                result.push(a)
            }
        }
        return result
    })

    public readonly loadingDomainNameSearchAgents = computed(() => {
        const result: DomainNameSearchAgent[] = []
        for (const a of this.domainNameSearchAgents) {
            if (a.loading.value) {
                result.push(a)
            }
        }
        return result
    })

    public readonly candidateCount = computed(() => {
        let result = 0
        for (const a of this.allAgents) {
            result += a.candidates.value.length
        }
        return result
    })

    public findAgentById(id: string): SearchAgent<unknown, unknown> | null {
        let result: SearchAgent<unknown, unknown> | null = null
        for (const a of this.allAgents) {
            if (id == a.id) {
                result = a
                break
            }
        }
        return result
    }

    //
    // Private
    //

    private actualInputTextDidChange = (): void => {

        const baseRealm = routeManager.currentNetworkEntry.value.baseRealm
        const baseShard = routeManager.currentNetworkEntry.value.baseShard
        const searchedText = this.actualInputText.value
        const transactionID = TransactionID.parse(searchedText)
        const hexBytes = hexToByte(searchedText)
        const alias = AccountAlias.parse(searchedText) != null ? searchedText : null
        const timestamp = Timestamp.parse(searchedText)
        const domainName = /\.[a-zA-Z|ℏ]+$/.test(searchedText) ? searchedText : null
        const positiveInt = EntityID.parsePositiveInt(searchedText)
        const entityID = EntityID.parseWithChecksum(searchedText)
            ?? (positiveInt != null ? new EntityID(baseShard, baseRealm, positiveInt, null) : null)
        const blockNb = positiveInt

        // const isTokenName = searchedText.length >= 3 && isASCII(searchedText)
        const isTokenName = searchedText.length >= 3
            && isASCII(searchedText)
            && entityID === null
            && transactionID === null
            && hexBytes === null
            && timestamp === null
        const tokenName = isTokenName ? searchedText : null

        this.accountSearchAgent.loc.value = entityID ?? hexBytes ?? alias
        this.contractSearchAgent.loc.value = entityID ?? hexBytes
        this.tokenSearchAgent.loc.value = entityID ?? hexBytes
        this.topicSearchAgent.loc.value = entityID
        this.scheduleSearchAgent.loc.value = entityID
        this.transactionSearchAgent.loc.value = transactionID ?? timestamp ?? hexBytes
        this.blockSearchAgent.loc.value = blockNb ?? hexBytes
        this.narrowTokenNameSearchAgent.loc.value = tokenName
        this.fullTokenNameSearchAgent.loc.value = tokenName
        this.erc20SearchAgent.loc.value = tokenName
        this.erc721SearchAgent.loc.value = tokenName

        for (const a of this.domainNameSearchAgents) {
            a.loc.value = domainName
        }
    }
}

function isASCII(s: string): boolean {
    let result = true
    for (let i = 0; i < s.length; i += 1) {
        if (s.charCodeAt(i) > 255) { // 255 … or 127 ?
            result = false
            break
        }
    }
    return result
}
