// SPDX-License-Identifier: Apache-2.0

import {Ref, ref, watch} from "vue";
import {EntityID} from "@/utils/EntityID";
import {
    AccountBalanceTransactions,
    AccountInfo,
    AccountsResponse,
    Block,
    ContractResponse,
    ContractResultDetails,
    Schedule,
    TokenInfo,
    TokensResponse,
    Topic,
    Transaction,
    TransactionByIdResponse,
    TransactionResponse
} from "@/schemas/MirrorNodeSchemas";
import {drainAccounts} from "@/schemas/MirrorNodeUtils.ts";
import {aliasToBase32, byteToHex, paddedBytes} from "@/utils/B64Utils";
import axios from "axios";
import {RouteLocationRaw} from "vue-router";
import {routeManager} from "@/router";
import {TransactionID} from "@/utils/TransactionID";
import {Timestamp} from "@/utils/Timestamp";
import {NameRecord, NameService} from "@/utils/name_service/NameService";
import {NameServiceProvider} from "@/utils/name_service/provider/NameServiceProvider";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";
import {AppStorage} from "@/AppStorage";
import {SelectedTokensCache} from "@/utils/cache/SelectedTokensCache";
import {ERC20Cache} from "@/utils/cache/ERC20Cache.ts";
import {ERC721Cache} from "@/utils/cache/ERC721Cache.ts";

export abstract class SearchAgent<L, E> {

    public readonly loading = ref<boolean>(false)
    public readonly loc: Ref<L | null> = ref(null)
    public readonly candidates: Ref<SearchCandidate<E>[]> = ref([])
    private readonly abortController = new AbortController()

    //
    // Public
    //


    public willNavigate(candidate: SearchCandidate<E>): void {
        // Possibly override by subclasses
    }


    //
    // Protected
    //

    protected constructor(public readonly title: string, public readonly id = this.constructor.name) {
        watch(this.loc, this.entityLocDidChange)
    }


    protected /* abstract */ async load(loc: L, abortController: AbortController): Promise<SearchCandidate<E>[]> {
        return Promise.reject("To be subclassed")
    }

    protected readonly entityLocDidChange = async () => {

        if (this.loading.value) {
            this.abortController.abort()
        }

        this.loading.value = true
        try {
            if (this.loc.value !== null) {
                this.candidates.value = await this.load(this.loc.value, this.abortController)
            } else {
                this.candidates.value = []
            }
            this.loading.value = false
        } catch (reason) {
            this.candidates.value = []
            if (!this.isAbortError(reason)) {
                this.loading.value = false
            }
        }

    }

    //
    // Private
    //

    private isAbortError(reason: unknown): boolean {
        return reason instanceof DOMException && reason.name == "AbortError"
    }

}

export class SearchCandidate<E> {
    constructor(readonly description: string,
                readonly extra: string | null,
                readonly route: RouteLocationRaw | null,
                readonly entity: E,
                readonly agent: SearchAgent<unknown, E>,
                readonly secondary: boolean = false) {
    }
}


export class AccountSearchAgent extends SearchAgent<EntityID | Uint8Array | string, AccountInfo> {

    //
    // Public
    //

    public constructor() {
        super("Account");
    }

    //
    // SearchAgent
    //

    protected async load(accountParam: EntityID | Uint8Array | string): Promise<SearchCandidate<AccountInfo>[]> {

        let accountLoc: string | Uint8Array
        if (accountParam instanceof EntityID) {
            accountLoc = accountParam.toString()
        } else if (accountParam instanceof Uint8Array) {
            if (accountParam.length == 32 || accountParam.length == 33) {
                // accountParam is a public key
                // https://testnet.mirrornode.hedera.com/api/v1/docs/#/accounts/listAccounts
                accountLoc = accountParam
            } else if (accountParam.length <= 20) {
                // accountParam is an evm address (possibly partial)
                accountLoc = byteToHex(paddedBytes(accountParam, 20))
            } else {
                // account alias in hex form
                accountLoc = aliasToBase32(accountParam)
            }
        } else {
            // account alias in base 32
            accountLoc = accountParam
        }

        let accountInfos: AccountInfo[]
        let drained: boolean
        try {
            if (accountLoc instanceof Uint8Array) {
                // accountParam is a public key
                // https://testnet.mirrornode.hedera.com/api/v1/docs/#/accounts/listAccounts
                const publicKey = byteToHex(accountLoc)
                const limit = 10
                const r = await axios.get<AccountsResponse>("api/v1/accounts/?account.publickey=" + publicKey + "&limit=" + limit)
                accountInfos = await drainAccounts(r.data, limit)
                drained = (r.data.links?.next ?? null) == null
            } else {
                // https://testnet.mirrornode.hedera.com/api/v1/docs/#/accounts/getAccountByIdOrAliasOrEvmAddress
                const r = await axios.get<AccountBalanceTransactions>("api/v1/accounts/" + accountLoc)
                accountInfos = [r.data]
                drained = true
            }
        } catch {
            accountInfos = []
            drained = true
        }

        let result: SearchCandidate<AccountInfo>[]
        if (accountInfos.length == 1) {
            const accountInfo = accountInfos[0]
            if (accountInfo.account) {
                const description = accountInfo.account
                const route = routeManager.makeRouteToAccount(accountInfo.account)
                const candidate = new SearchCandidate<AccountInfo>(description, null, route, accountInfo, this)
                result = [candidate]
            } else {
                result = []
            }
        } else if (accountInfos.length >= 2) { // => accountLoc instanceof Uint8Array
            result = []
            for (const a of accountInfos) {
                if (a.account !== null) {
                    const description = a.account
                    const route = routeManager.makeRouteToAccount(a.account)
                    const candidate = new SearchCandidate<AccountInfo>(description, null, route, a, this)
                    result.push(candidate)
                }
            }
            if (!drained) {
                // There's more than 10 accounts matching accountLoc => we display a navigation link
                const description = "Show more…"
                const key = byteToHex(accountLoc as Uint8Array)
                const route = routeManager.makeRouteToAccountsWithKey(key)
                const accountInfo0 = accountInfos[0]
                const candidate = new SearchCandidate<AccountInfo>(description, null, route, accountInfo0, this, true)
                result.push(candidate)
            }
        } else {
            result = []
        }

        return Promise.resolve(result)
    }
}


export class ContractSearchAgent extends SearchAgent<EntityID | Uint8Array, ContractResponse> {

    //
    // Public
    //

    public constructor() {
        super("Contract");
    }

    //
    // SearchAgent
    //

    protected async load(contractParam: EntityID | Uint8Array): Promise<SearchCandidate<ContractResponse>[]> {

        let contractLoc: string | null
        if (contractParam instanceof EntityID) {
            contractLoc = contractParam.toString()
        } else if (contractParam.length <= 20) {
            // contractParam is an evm address (possibly partial)
            contractLoc = byteToHex(paddedBytes(contractParam, 20))
        } else {
            contractLoc = null
        }

        let contractInfo: ContractResponse | null
        if (contractLoc !== null) {
            // https://testnet.mirrornode.hedera.com/api/v1/docs/#/contracts/getContractById
            const r = await axios.get<ContractResponse>("api/v1/contracts/" + contractLoc)
            contractInfo = r.data
        } else {
            contractInfo = null
        }

        let result: SearchCandidate<ContractResponse>[]
        if (contractInfo !== null && contractInfo.contract_id) {
            const description = contractInfo.contract_id
            const route = routeManager.makeRouteToContract(contractInfo.contract_id)
            const candidate = new SearchCandidate<ContractResponse>(description, null, route, contractInfo, this)
            result = [candidate]
        } else {
            result = []
        }

        return Promise.resolve(result)
    }

}

export class TokenSearchAgent extends SearchAgent<EntityID | Uint8Array, TokenInfo> {

    //
    // Public
    //

    public constructor() {
        super("Token");
    }

    //
    // SearchAgent
    //

    protected async load(tokenParam: EntityID | Uint8Array): Promise<SearchCandidate<TokenInfo>[]> {

        let tokenLoc: string | null
        if (tokenParam instanceof EntityID) {
            tokenLoc = tokenParam.toString()
        } else if (tokenParam.length <= 20) {
            // accountParam is an evm address (possibly partial)
            const evmAddress = byteToHex(paddedBytes(tokenParam, 20))
            const network = routeManager.currentNetworkEntry.value
            const entityID = EntityID.fromAddress(evmAddress, network.baseShard, network.baseRealm)
            tokenLoc = entityID !== null ? entityID.toString() : null
        } else {
            tokenLoc = null
        }

        let tokenInfo: TokenInfo | null
        if (tokenLoc !== null) {
            try {
                // https://testnet.mirrornode.hedera.com/api/v1/docs/#/contracts/getContractById
                const r = await axios.get<TokenInfo>("api/v1/tokens/" + tokenLoc)
                tokenInfo = r.data
            } catch {
                tokenInfo = null
            }
        } else {
            tokenInfo = null
        }

        let result: SearchCandidate<TokenInfo>[]
        if (tokenInfo !== null && tokenInfo.token_id !== null) {
            const description = tokenInfo.token_id
            const route = routeManager.makeRouteToToken(tokenInfo.token_id)
            const candidate = new SearchCandidate(description, null, route, tokenInfo, this)
            result = [candidate]
        } else {
            result = []
        }

        return Promise.resolve(result)
    }

}

export class TopicSearchAgent extends SearchAgent<EntityID, Topic> {

    //
    // Public
    //

    public constructor() {
        super("Topic");
    }

    //
    // SearchAgent
    //

    protected async load(topicID: EntityID): Promise<SearchCandidate<Topic>[]> {
        let result: SearchCandidate<Topic>[]
        try {
            const tid = topicID.toString()
            const topicInfo = (await axios.get<Topic>("api/v1/topics/" + tid)).data
            const description = tid
            const route = routeManager.makeRouteToTopic(tid)
            const candidate = new SearchCandidate(description, null, route, topicInfo, this)
            result = [candidate]
        } catch {
            result = []
        }

        return Promise.resolve(result)
    }
}

export class TransactionSearchAgent extends SearchAgent<TransactionID | Timestamp | Uint8Array, Transaction> {

    //
    // Public
    //

    public constructor() {
        super("Transaction");
    }

    //
    // SearchAgent
    //

    protected async load(transactionParam: TransactionID | Timestamp | Uint8Array): Promise<SearchCandidate<Transaction>[]> {
        let result: SearchCandidate<Transaction>[]
        try {
            let transactions: Transaction[]
            if (transactionParam instanceof TransactionID) {
                const tid = transactionParam.toString(false)
                const queryParams = transactionParam.queryParam === "scheduled" ? "?scheduled=true" : ""
                // https://testnet.mirrornode.hedera.com/api/v1/docs/#/transactions/getTransactionById
                const r = await axios.get<TransactionByIdResponse>("api/v1/transactions/" + tid + queryParams)
                transactions = r.data.transactions ?? []
            } else if (transactionParam instanceof Timestamp) {
                // https://testnet.mirrornode.hedera.com/api/v1/docs/#/transactions/listTransactions
                const t = transactionParam.toString()
                const r = await axios.get<TransactionResponse>("api/v1/transactions?timestamp=" + t)
                transactions = r.data.transactions ?? []
            } else {
                if (transactionParam.length == 48) { // Hedera hash
                    // https://testnet.mirrornode.hedera.com/api/v1/docs/#/transactions/getTransactionById
                    const r = await axios.get<TransactionByIdResponse>("api/v1/transactions/" + byteToHex(transactionParam))
                    transactions = r.data.transactions ?? []
                } else if (transactionParam.length == 32) { // Ethereum hash
                    const r1 = await axios.get<ContractResultDetails>("api/v1/contracts/results/" + byteToHex(transactionParam))
                    const r2 = await axios.get<TransactionResponse>("api/v1/transactions?timestamp=" + r1.data.timestamp)
                    transactions = r2.data.transactions ?? []
                } else {
                    transactions = []
                }
            }
            result = this.makeCandidates(transactionParam, transactions ?? [])
        } catch {
            result = []
        }

        return Promise.resolve(result)
    }

    //
    // Private
    //

    private makeCandidates(transactionParam: TransactionID | Timestamp | Uint8Array, transactions: Transaction[]): SearchCandidate<Transaction>[] {
        let result: SearchCandidate<Transaction>[]
        if (transactions.length >= 1) {
            const transaction0 = transactions[0]
            const displayTransactionID = TransactionID.normalizeForDisplay(transaction0.transaction_id)
            if (transactionParam instanceof TransactionID) {
                if (transactions.length == 1) {
                    const description = displayTransactionID
                    const route = routeManager.makeRouteToTransaction(transaction0.consensus_timestamp)
                    const candidate = new SearchCandidate<Transaction>(description, null, route, transaction0, this)
                    result = [candidate]
                } else {
                    const description = "All transactions with ID " + displayTransactionID
                    const route = routeManager.makeRouteToTransactionsById(transaction0.transaction_id)
                    const candidate = new SearchCandidate<Transaction>(description, null, route, transaction0, this)
                    result = [candidate]
                }
            } else if (transactionParam instanceof Timestamp) {
                const description = displayTransactionID
                const route = routeManager.makeRouteToTransaction(transactionParam.toString())
                const candidate = new SearchCandidate<Transaction>(description, null, route, transaction0, this)
                result = [candidate]
            } else { // transactionParam instanceof Uint8Array
                const description = displayTransactionID
                const route = routeManager.makeRouteToTransaction(transaction0.consensus_timestamp)
                const candidate = new SearchCandidate<Transaction>(description, null, route, transaction0, this)
                result = [candidate]
            }
        } else {
            result = []
        }
        return result
    }

}

export class DomainNameSearchAgent extends SearchAgent<string, DomainNameResolution> {

    //
    // Public
    //

    public constructor(public readonly provider: NameServiceProvider) {
        super("Account on " + provider.providerAlias,
            "DomainNameSearchAgent-" + provider.providerAlias)
    }

    //
    // SearchAgent
    //

    public willNavigate(candidate: SearchCandidate<DomainNameResolution>): void {
        const record = candidate.entity.record
        const network = routeManager.currentNetwork.value
        AppStorage.setNameRecord(record.entityId, network, record)
    }

    protected async load(domainName: string): Promise<SearchCandidate<DomainNameResolution>[]> {
        let result: SearchCandidate<DomainNameResolution> | null
        try {
            const network = routeManager.currentNetwork.value
            const record = await NameService.instance.singleResolve(domainName, network, this.provider.providerAlias)
            if (record !== null) {
                const accountInfo = await AccountByIdCache.instance.lookup(record.entityId)
                const description = record.entityId
                const nonExistent = accountInfo == null
                const extra = nonExistent ? "non-existent" : null
                const route = nonExistent ? null : routeManager.makeRouteToAccount(record.entityId)
                const resolution = new DomainNameResolution(record, accountInfo)
                result = new SearchCandidate(description, extra, route, resolution, this)
            } else {
                result = null
            }
        } catch {
            result = null
        }
        return result !== null ? [result] : []
    }

}

export class DomainNameResolution {
    constructor(public readonly record: NameRecord, public readonly accountInfo: AccountInfo | null) {
    }
}

export class BlockSearchAgent extends SearchAgent<number | Uint8Array, Block> {

    //
    // Public
    //

    public constructor() {
        super("Block");
    }

    //
    // SearchAgent
    //

    protected async load(blockParam: number | Uint8Array): Promise<SearchCandidate<Block>[]> {
        let result: SearchCandidate<Block>[]
        try {
            let block: Block | null
            if (blockParam instanceof Uint8Array) {
                if (blockParam.length == 48) {
                    block = (await axios.get<Block>("api/v1/blocks/" + byteToHex(blockParam))).data
                } else {
                    block = null
                }
            } else {
                block = (await axios.get<Block>("api/v1/blocks/" + blockParam)).data
            }
            if (block !== null && block.number) {
                const description = block.number.toString()
                const route = routeManager.makeRouteToBlock(block.number ?? 1)
                const candidate = new SearchCandidate<Block>(description, null, route, block, this)
                result = [candidate]
            } else {
                result = []
            }
        } catch {
            result = []
        }

        return Promise.resolve(result)
    }

}

export abstract class TokenNameSearchAgent extends SearchAgent<string, TokenLike> {

    private readonly limit = 10

    //
    // Protected (to be subclassed)
    //

    protected constructor(title: string) {
        super(title)
    }


    protected async loadTokens(tokenName: string): Promise<TokenLike[]> {
        throw "Must be subclassed"
    }

    protected abstract makeRoute(tokenName: string): RouteLocationRaw

    protected makeRouteToDetails(tokenId: string): RouteLocationRaw {
        return routeManager.makeRouteToToken(tokenId)
    }

    //
    // SearchAgent
    //

    protected async load(tokenName: string): Promise<SearchCandidate<TokenLike>[]> {

        let tokens: TokenLike[]
        try {
            tokens = await this.loadTokens(tokenName)
        } catch {
            tokens = []
        }

        const truncate = (value: string, length: number): string => {
            return value.length > length ? value.slice(0, length) + '…' : value
        }

        const result: SearchCandidate<TokenLike>[] = []
        if (tokens.length >= 1) {
            for (const t of tokens.slice(0, this.limit)) {
                if (t.token_id !== null) {
                    const description = truncate(t.name, 35)
                    const extra = " " + t.token_id
                    const route = this.makeRouteToDetails(t.token_id)
                    const candidate = new SearchCandidate<TokenLike>(description, extra, route, t, this)
                    result.push(candidate)
                }
            }
            if (tokens.length > this.limit) {
                const description = "Show more…"
                const route = this.makeRoute(tokenName)
                const candidate
                    = new SearchCandidate<TokenLike>(description, null, route, tokens[0], this, true)
                result.push(candidate)
            }
        }

        return Promise.resolve(result)
    }

}

export class NarrowTokenNameSearchAgent extends TokenNameSearchAgent {

    //
    // Public
    //

    public constructor() {
        super("Popular Tokens")
    }

    //
    // TokenNameSearchAgent
    //

    protected async loadTokens(tokenName: string): Promise<TokenLike[]> {
        let result: TokenLike[]
        if (routeManager.currentNetwork.value == "mainnet") {
            const index = await SelectedTokensCache.instance.lookup()
            result = index.search(tokenName)
        } else {
            result = []
        }
        return Promise.resolve(result)
    }

    protected makeRoute(tokenName: string): RouteLocationRaw {
        return routeManager.makeRouteToTokensByPopularity(tokenName)
    }
}

export class FullTokenNameSearchAgent extends TokenNameSearchAgent {

    //
    // Public
    //

    public constructor() {
        super("All Tokens")
    }

    //
    // TokenNameSearchAgent
    //

    protected async loadTokens(tokenName: string): Promise<TokenLike[]> {
        // https://previewnet.mirrornode.hedera.com/api/v1/docs/#/tokens/getToken
        const r = await axios.get<TokensResponse>("api/v1/tokens/?name=" + tokenName + "&limit=100")
        const result = r.data.tokens ?? []
        result.sort((t1: TokenLike, t2: TokenLike) => FullTokenNameSearchAgent.compareToken(t1, t2, tokenName))
        return Promise.resolve(result)
    }

    protected makeRoute(tokenName: string): RouteLocationRaw {
        return routeManager.makeRouteToTokensByName(tokenName)
    }

    //
    // Private
    //

    /*
        This comparison function ensures the following ordering:
            1) first tokens whose name matches target
            2) next tokens whose name starts with target
            3) then other tokens
     */

    private static compareToken(t1: TokenLike, t2: TokenLike, target: string): number {
        let result: number
        const n1 = t1.name.toLocaleLowerCase()
        const n2 = t2.name.toLocaleLowerCase()
        const t = target.toLocaleLowerCase()
        if (n1 == t) {
            if (n2 == t) {
                result = t1.name.localeCompare(t2.name)
            } else {
                result = -1                     // n1 before n2
            }
        } else if (n1.startsWith(t)) {
            if (n2 == t) {
                result = +1                     // n1 after n2
            } else if (n2.startsWith(t)) {
                result = t1.name.localeCompare(t2.name)
            } else {
                result = -1                     // n1 before n2
            }
        } else {
            if (n2 == t) {
                result = +1                     // n1 after n2
            } else if (n2.startsWith(t)) {
                result = +1                     // n1 after n2
            } else {
                result = t1.name.localeCompare(t2.name)
            }
        }
        return result
    }
}

export interface TokenLike {
    token_id: string | null
    name: string
}


export class ScheduleSearchAgent extends SearchAgent<EntityID, Schedule> {

    //
    // Public
    //

    public constructor() {
        super("Schedule");
    }

    //
    // SearchAgent
    //

    protected async load(schedID: EntityID): Promise<SearchCandidate<Schedule>[]> {
        let result: SearchCandidate<Schedule>[]
        try {
            const sid = schedID.toString()
            const scheduleInfo = (await axios.get<Schedule>("api/v1/schedules/" + sid)).data
            const description = sid
            const route = routeManager.makeRouteToSchedule(sid)
            const candidate = new SearchCandidate(description, null, route, scheduleInfo, this)
            result = [candidate]
        } catch {
            result = []
        }

        return Promise.resolve(result)
    }
}


export class ERC20SearchAgent extends TokenNameSearchAgent {

    //
    // Public
    //

    public constructor() {
        super("ERC 20")
    }

    //
    // TokenNameSearchAgent
    //

    protected async loadTokens(tokenName: string): Promise<TokenLike[]> {
        const result: TokenLike[] = []

        const tokens = await ERC20Cache.instance.search(tokenName)
        for (const t of tokens) {
            result.push({
                token_id: t.contractId,
                name: t.name!,
            })
        }
        return Promise.resolve(result)
    }

    protected makeRouteToDetails(tokenId: string): RouteLocationRaw {
        return routeManager.makeRouteToContract(tokenId);
    }

    protected makeRoute(tokenName: string): RouteLocationRaw {
        return routeManager.makeRouteToERC20ByName(tokenName)
    }
}

export class ERC721SearchAgent extends TokenNameSearchAgent {

    //
    // Public
    //

    public constructor() {
        super("ERC 721")
    }

    //
    // TokenNameSearchAgent
    //

    protected async loadTokens(tokenName: string): Promise<TokenLike[]> {
        const result: TokenLike[] = []

        const tokens = await ERC721Cache.instance.search(tokenName)
        for (const t of tokens) {
            result.push({
                token_id: t.contractId,
                name: t.name!,
            })
        }
        return Promise.resolve(result)
    }

    protected makeRouteToDetails(tokenId: string): RouteLocationRaw {
        return routeManager.makeRouteToContract(tokenId);
    }

    protected makeRoute(tokenName: string): RouteLocationRaw {
        return routeManager.makeRouteToERC721ByName(tokenName)
    }
}
