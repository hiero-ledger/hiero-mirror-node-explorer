// SPDX-License-Identifier: Apache-2.0

import {
    createRouter,
    createWebHistory,
    NavigationFailure,
    RouteLocationNormalized,
    RouteLocationNormalizedLoaded,
    RouteLocationRaw,
    Router,
    RouteRecordRaw
} from "vue-router";
import {App, computed, shallowRef, watch} from "vue";
import {AppStorage} from "@/AppStorage";
import axios from "axios";
import {Transaction, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {CacheUtils} from "@/utils/cache/CacheUtils";
import {TransactionID} from "@/utils/TransactionID.ts";
import {CoreConfig} from "@/config/CoreConfig";
import {NetworkConfig, NetworkEntry} from "@/config/NetworkConfig";
import {WalletManagerV4} from "@/utils/wallet/WalletManagerV4.ts";
import {
    ACCOUNT_DETAILS_ROUTE,
    BLOCK_DETAILS_ROUTE,
    CONTRACT_DETAILS_ROUTE,
    routes,
    TOKEN_DETAILS_ROUTE,
    TOPIC_DETAILS_ROUTE
} from "@/router.ts";

export class RouteManager {

    public readonly router: Router
    public readonly coreConfig = shallowRef(CoreConfig.FALLBACK)
    public readonly networkConfig = shallowRef(NetworkConfig.FALLBACK)

    //
    // Public
    //

    public constructor() {

        this.router = createRouter({
            history: createWebHistory(),
            routes: [] // Will be set by this.configure()
        })

        this.router.beforeEach(this.checkNetwork)
        this.router.beforeEach(this.setupTitleAndHeaders)

        const currentNetworkDidChange = () => {
            axios.defaults.baseURL = this.currentNetworkEntry.value.url
            this.switchThemes()
        }
        watch(this.currentNetwork, () => {
            currentNetworkDidChange()
            AppStorage.setLastNetwork(this.currentNetwork.value)
            CacheUtils.clearAll()
        }) // watch({ immediate: true }) causes an infinite loop
        currentNetworkDidChange()

        this.configure(CoreConfig.FALLBACK, NetworkConfig.FALLBACK)
    }

    public readonly currentNetwork = computed(() => this.currentNetworkEntry.value.name)

    public readonly currentRouteRootMatch = computed(() => {
        const matched = this.router.currentRoute.value.matched
        return matched.length >= 1 ? matched[0] : null
    })

    public readonly currentRouteLeafMatch = computed(() => {
        const matched = this.router.currentRoute.value.matched
        return matched.length >= 1 ? matched[matched.length-1] : null
    })

    public readonly currentTabId = computed(() => {
        return this.currentRouteRootMatch.value?.meta?.tabId ?? null
    })

    public readonly enableWallet = computed(() => {
        return this.currentNetworkEntry.value.enableWallet
    })

    public readonly enableStaking = computed(() => {
        return this.currentNetworkEntry.value.enableStaking
    })

    public readonly enableExpiry = computed(() => {
        return this.currentNetworkEntry.value.enableExpiry
    })

    public readonly enableMarket = computed(() => {
        return this.currentNetworkEntry.value.enableMarket
    })

    public readonly nbNetworks = computed(() => {
        return this.networkConfig.value.entries.length
    })

    public readonly currentNetworkEntry = computed(() => {
        let networkName: string | null
        const networkParam = this.router.currentRoute.value?.params?.network
        if (Array.isArray(networkParam)) {
            networkName = networkParam.length >= 1 ? networkParam[0] : null
        } else {
            networkName = networkParam
        }
        const networkEntry = networkName != null ? this.networkConfig.value.lookup(networkName) : null

        return networkEntry != null ? networkEntry : this.networkConfig.value.entries[0]
    })

    public readonly hgraphKey = computed(() => {
        return this.coreConfig.value.hgraphKey
    })

    public readonly hgraphURL = computed(() => {
        let result: string | null
        const hgraphKey = this.hgraphKey.value
        switch (this.currentNetworkEntry.value.url) {
            case "https://mainnet-public.mirrornode.hedera.com/":
            case "https://mainnet.mirrornode.hedera.com/":
                result = hgraphKey !== null
                    ? "https://mainnet.hedera.api.hgraph.io/v1/graphql"
                    : "https://mainnet.hedera.api.hgraph.dev/v1/graphql"
                break
            case "https://testnet.mirrornode.hedera.com/":
                result = hgraphKey !== null
                    ? "https://testnet.hedera.api.hgraph.io/v1/graphql"
                    : "https://testnet.hedera.api.hgraph.dev/v1/graphql"
                break
            default:
                result = null
                break
        }
        return result
    })

    public configure(coreConfig: CoreConfig, networkConfig: NetworkConfig) {

        this.coreConfig.value = coreConfig
        this.networkConfig.value = networkConfig

        //
        // Rebuilds route array
        //

        this.router.clearRoutes()

        const defaultNetwork = AppStorage.getLastNetwork() ?? networkConfig.entries[0].name
        this.router.addRoute({
            path: '/',
            redirect: '/' + defaultNetwork + '/home'
        })
        this.router.addRoute({
            path: '/page-not-found',
            redirect: '/' + defaultNetwork + '/page-not-found'
        })
        for (const r of routes) {
            this.router.addRoute(r)
        }
        this.switchThemes()
    }

    public findChainID(network: string): number | null {
        let result: number | null
        const entry = this.networkConfig.value.lookup(network)
        if (entry !== null) {
            result = entry.sourcifySetup?.chainID ?? null
        } else {
            result = null
        }
        return result
    }

    public readonly walletConnectID = computed(() => this.coreConfig.value.walletConnectID)


    //
    // Public (routeToXXX)
    //

    //
    // Transaction
    //

    public routeToTransaction(t: Transaction, event: Event): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToTransaction(t.consensus_timestamp));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else {
            result = this.router.push(this.makeRouteToTransaction(t.consensus_timestamp))
        }
        return result
    }

    public routeToTransactionByTs(consensusTimestamp: string | undefined, event: Event): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToTransaction(consensusTimestamp));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else {
            result = this.router.push(this.makeRouteToTransaction(consensusTimestamp))
        }
        return result
    }

    public makeRouteToTransactionObj(transaction: Transaction): RouteLocationRaw {
        return this.makeRouteToTransaction(transaction.consensus_timestamp)
    }

    public makeRouteToTransaction(transactionLoc: string | undefined): RouteLocationRaw {
        return {
            name: 'TransactionDetails',
            params: {transactionLoc: transactionLoc, network: this.currentNetwork.value}
        }
    }

    //
    // TransactionsById
    //

    public makeRouteToTransactionsById(transactionId: string): RouteLocationRaw {
        return {name: 'TransactionsById', params: {transactionId: transactionId, network: this.currentNetwork.value}}
    }

    //
    // Schedule
    //

    public makeRouteToSchedule(scheduleId: string): RouteLocationRaw {
        return {
            name: 'ScheduleDetails',
            params: {scheduleId: scheduleId, network: this.currentNetwork.value}
        }
    }

    //
    // Account
    //

    public readonly accountDetailsOperator = new RouteOperator(ACCOUNT_DETAILS_ROUTE, this)

    public makeRouteToAccount(accountId: string, tabId: string | null = null): RouteLocationRaw {
        const targetTabId = tabId ?? this.accountDetailsOperator.defaultTabId
        return {
            name: targetTabId,
            params: {accountId: accountId, network: this.currentNetwork.value}
        }
    }

    public routeToAccount(accountId: string, event: Event | null, tabId: string | null = null, replace = false): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToAccount(accountId));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else if (replace) {
            result = this.router.replace(this.makeRouteToAccount(accountId, tabId))
        } else {
            result = this.router.push(this.makeRouteToAccount(accountId, tabId))
        }
        return result
    }

    //
    // Accounts with key
    //

    public makeRouteToAccountsWithKey(pubKey: string): RouteLocationRaw {
        return {
            name: 'AccountsWithKey', params: {pubKey: pubKey, network: this.currentNetwork.value}
        }
    }

    //
    // Admin Key
    //

    public makeRouteToAdminKey(accountId: string): RouteLocationRaw {
        return {
            name: 'AdminKeyDetails', params: {accountId: accountId, network: this.currentNetwork.value}
        }
    }

    public makeRouteToNodeAdminKey(nodeId: string): RouteLocationRaw {
        return {
            name: 'NodeAdminKeyDetails', params: {nodeId: nodeId, network: this.currentNetwork.value}
        }
    }

    //
    // Token
    //

    public readonly tokenDetailsOperator = new RouteOperator(TOKEN_DETAILS_ROUTE, this)

    public makeRouteToToken(tokenId: string, tabId: string | null = null): RouteLocationRaw {
        const targetTabId = tabId ?? this.tokenDetailsOperator.defaultTabId
        return {name: targetTabId, params: {tokenId: tokenId, network: this.currentNetwork.value}}
    }

    public routeToToken(tokenId: string, event: Event | null, tabId: string | null = null, replace = false): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToToken(tokenId, tabId));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else if (replace) {
            result = this.router.replace(this.makeRouteToToken(tokenId, tabId))
        } else {
            result = this.router.push(this.makeRouteToToken(tokenId, tabId))
        }
        return result
    }

    public makeRouteToSerial(tokenId: string, serialNumber: number): RouteLocationRaw {
        return {
            name: 'NftDetails',
            params: {tokenId: tokenId, serialNumber: serialNumber, network: this.currentNetwork.value}
        }
    }

    public makeRouteToCollection(accountId: string, tokenId: string): RouteLocationRaw {
        return {
            name: 'AccountCollection',
            params: {accountId: accountId, tokenId: tokenId, network: this.currentNetwork.value}
        }
    }

    public routeToSerial(tokenId: string, serialNumber: number, event: Event): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToSerial(tokenId, serialNumber))
            window.open(routeData.href, '_blank')
            result = Promise.resolve()
        } else {
            result = this.router.push(this.makeRouteToSerial(tokenId, serialNumber))
        }
        return result
    }

    public makeRouteToTokensByName(name: string): RouteLocationRaw {
        return {
            name: 'TokensByName',
            params: {name: name, network: this.currentNetwork.value}
        }
    }

    public makeRouteToTokensByPopularity(name: string): RouteLocationRaw {
        return {
            name: 'TokensByPopularity',
            params: {name: name, network: this.currentNetwork.value}
        }
    }

    public makeRouteToTokensByAccount(accountId: string): RouteLocationRaw {
        return {
            name: 'TokensByAccount',
            params: {accountId: accountId, network: this.currentNetwork.value}
        }
    }

    //
    // Contract
    //

    public readonly contractDetailsOperator = new RouteOperator(CONTRACT_DETAILS_ROUTE, this)

    public makeRouteToContract(contractId: string, tabId: string | null = null): RouteLocationRaw {
        const targetTabId = tabId ?? this.contractDetailsOperator.defaultTabId
        return {name: targetTabId, params: {contractId: contractId, network: this.currentNetwork.value}}
    }

    public routeToContract(contractId: string, event: Event | null, tabId: string | null = null, replace = false): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToContract(contractId, tabId));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else if (replace) {
            result = this.router.replace(this.makeRouteToContract(contractId, tabId))
        } else {
            result = this.router.push(this.makeRouteToContract(contractId, tabId))
        }
        return result
    }

    public makeRouteToERC20ByName(name: string): RouteLocationRaw {
        return {
            name: 'ERC20ByName',
            params: {name: name, network: this.currentNetwork.value}
        }
    }

    public makeRouteToERC721ByName(name: string): RouteLocationRaw {
        return {
            name: 'ERC721ByName',
            params: {name: name, network: this.currentNetwork.value}
        }
    }

    //
    // Topic
    //

    public readonly topicDetailsOperator = new RouteOperator(TOPIC_DETAILS_ROUTE, this)

    public makeRouteToTopic(topicId: string, tabId: string | null = null): RouteLocationRaw {
        const targetTabId = tabId ?? this.topicDetailsOperator.defaultTabId
        return {name: targetTabId, params: {topicId: topicId, network: this.currentNetwork.value}}
    }

    public routeToTopic(topicId: string, event: Event | null, tabId: string | null = null, replace = false): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToTopic(topicId, tabId));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else if (replace) {
            result = this.router.replace(this.makeRouteToTopic(topicId, tabId))
        } else {
            result = this.router.push(this.makeRouteToTopic(topicId, tabId))
        }
        return result
    }

    //
    // Block
    //

    public readonly blockDetailsOperator = new RouteOperator(BLOCK_DETAILS_ROUTE, this)

    public makeRouteToBlock(blockHon: string | number, tabId: string|null = null): RouteLocationRaw {
        const targetTabId = tabId ?? this.blockDetailsOperator.defaultTabId
        return {name: targetTabId, params: {blockHon: blockHon, network: this.currentNetwork.value}}
    }

    public routeToBlock(blockHon: string | number, event: Event | null = null, tabId: string|null = null, replace = false): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToBlock(blockHon, tabId));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else if (replace) {
            result = this.router.replace(this.makeRouteToBlock(blockHon, tabId))
        } else {
            result = this.router.push(this.makeRouteToBlock(blockHon, tabId))
        }
        return result
    }

    //
    // Node
    //

    public makeRouteToNode(nodeId: number): RouteLocationRaw {
        return {name: 'NodeDetails', params: {nodeId: nodeId, network: this.currentNetwork.value}}
    }

    public routeToNode(nodeId: number, event: Event): Promise<NavigationFailure | void | undefined> {
        let result: Promise<NavigationFailure | void | undefined>
        if (this.shouldOpenNewWindow(event)) {
            const routeData = this.router.resolve(this.makeRouteToNode(nodeId));
            window.open(routeData.href, '_blank');
            result = Promise.resolve()
        } else {
            result = this.router.push(this.makeRouteToNode(nodeId))
        }
        return result
    }

    //
    // SearchHelp
    //

    public makeRouteToSearchHelp(): RouteLocationRaw {
        return {
            name: 'SearchHelp'
        }
    }

    //
    // Main Pages
    //

    public makeRouteToHome(network: string | null = null): RouteLocationRaw {
        return {name: 'Home', params: {network: network ?? this.currentNetwork.value}}
    }

    public routeToHome(network: string | null = null): Promise<NavigationFailure | void | undefined> {
        return this.router.push(this.makeRouteToHome(network))
    }

    public makeRouteToTransactions(type: TransactionType | null = null): RouteLocationRaw {
        return {
            name: 'Transactions',
            params: {network: this.currentNetwork.value},
            query: type !== null ? {type: type} : undefined
        }
    }

    public makeRouteToTokens(): RouteLocationRaw {
        return {name: 'Tokens', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToTopics(): RouteLocationRaw {
        return {name: 'Topics', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToContracts(): RouteLocationRaw {
        return {name: 'Contracts', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToAccounts(): RouteLocationRaw {
        return {name: 'Accounts', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToNodes(): RouteLocationRaw {
        return {name: 'Nodes', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToStaking(): RouteLocationRaw {
        return {name: 'Staking', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToBlocks(): RouteLocationRaw {
        return {name: 'Blocks', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToMetrics(): RouteLocationRaw {
        return {name: 'Metrics', params: {network: this.currentNetwork.value}}
    }

    public makeRouteToPageNotFound(): RouteLocationRaw {
        return {name: 'PageNotFound', params: {network: this.currentNetwork.value}}
    }


    //
    // App plugin
    //

    public install(app: App): void {
        this.router.install(app)
    }


    //
    // Private
    //

    private shouldOpenNewWindow(e: Event|null): boolean {
        return e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)
    }

    private readonly checkNetwork = (to: RouteLocationNormalized): boolean | string => {
        let result: boolean | string

        if (this.getNetworkEntryFromRoute(to) === null) { // Unknown network
            result = "/page-not-found"
        } else {
            result = true
        }
        return result
    }

    private readonly setupTitleAndHeaders = (to: RouteLocationNormalized): void => {
        const envTitlePrefix = this.coreConfig.value.documentTitlePrefix
        const titlePrefix = envTitlePrefix !== "" ? envTitlePrefix + " " : ""

        switch (to.name as string) {
            case "Home":
                document.title = titlePrefix + "Home"
                break;
            case "TransactionsById":
                document.title = titlePrefix + "Transactions with ID " + TransactionID.normalizeForDisplay(to.params.transactionId as string)
                break;
            case "TransactionDetails":
                document.title = titlePrefix + "Transaction " + (to.query.tid ?? to.params.transactionLoc)
                break;
            case "TransactionDetails3091":
                document.title = titlePrefix + "Transaction " + to.params.transactionLoc
                break;
            case "ScheduleDetails":
                document.title = titlePrefix + "Schedule " + to.params.scheduleId
                break;
            case "TokenDetails":
                document.title = titlePrefix + "Token " + to.params.tokenId
                break;
            case "TopicDetails":
                document.title = titlePrefix + "Topic " + to.params.topicId
                break;
            case "ContractDetails":
                document.title = titlePrefix + "Contract " + to.params.contractId
                break;
            case "AccountDetails":
                document.title = titlePrefix + "Account " + to.params.accountId
                break;
            case "AdminKeyDetails":
                document.title = titlePrefix + "Admin Key for Account " + to.params.accountId
                break;
            case "NodeAdminKeyDetails":
                document.title = titlePrefix + "Admin Key for Node" + to.params.nodeId
                break;
            case "NodeDetails":
                document.title = titlePrefix + "Node " + to.params.nodeId
                break;
            case "BlockDetails":
                document.title = titlePrefix + "Block " + to.params.blockHon
                break;
            case "SearchHelp":
                document.title = "Search Results"
                break;
            case "PageNotFound":
                document.title = "Page Not Found"
                break;
            default:
                document.title = titlePrefix + (to.name as string)
        }

        this.addMetaTags()
    }

    private getNetworkEntryFromRoute(r: RouteLocationNormalized): NetworkEntry | null {

        let networkName: string | null
        const networkParam = r.params.network
        if (Array.isArray(networkParam)) {
            networkName = networkParam.length >= 1 ? networkParam[0] : null
        } else {
            networkName = networkParam
        }

        return networkName !== null ? this.networkConfig.value.lookup(networkName) : null
    }

    //
    // Private (addMetaTags)
    //

    private addMetaTags(): void {

        const title = document.title
        const productName = this.coreConfig.value.productName
        const description = this.coreConfig.value.metaDescription
        const url = this.coreConfig.value.metaURL

        this.createOrUpdateTagName('application-name', productName)
        this.createOrUpdateTagProperty('og:site_name', productName)
        if (description) {
            this.createOrUpdateTagName('description', description)
        }
        this.createOrUpdateTagProperty('og:title', title)
        if (url) {
            this.createOrUpdateTagProperty('og:url', url)
        }
    }

    private createOrUpdateTagName(name: string, content: string): void {
        const header = document.getElementsByTagName('head')[0]
        for (const tag of document.getElementsByTagName('meta')) {
            if (tag.getAttribute('name') === name) {
                header.removeChild(tag)
            }
        }
        const newTag = document.createElement('meta')
        newTag.name = name
        newTag.setAttribute('content', content)
        header.appendChild(newTag)
    }

    private createOrUpdateTagProperty(property: string, content: string): void {
        const header = document.getElementsByTagName('head')[0]
        for (const tag of document.getElementsByTagName('meta')) {
            if (tag.getAttribute('property') === property) {
                header.removeChild(tag)
            }
        }
        const newTag = document.createElement('meta')
        newTag.setAttribute('property', property)
        newTag.setAttribute('content', content)
        header.appendChild(newTag)
    }

    //
    // Private (switchThemes)
    //

    private switchThemes() {

        const colorMap = this.networkConfig.value.getColorMap(this.currentNetwork.value)

        if (colorMap !== null) {
            // Apply network theme colors to Light mode
            document.documentElement.style.setProperty('--light-network-button-text-color', colorMap.lightButtonTextColor)
            document.documentElement.style.setProperty('--light-network-button-color', colorMap.lightButtonColor)
            document.documentElement.style.setProperty('--light-network-chip-color', colorMap.lightChipColor)
            document.documentElement.style.setProperty('--light-network-text-accent-color', colorMap.lightTextAccentColor)
            document.documentElement.style.setProperty('--light-network-border-accent-color', colorMap.lightBorderAccentColor)
            document.documentElement.style.setProperty('--light-network-graph-bar-color', colorMap.lightGraphBarColor)
            document.documentElement.style.setProperty('--light-network-chip-text-color', colorMap.lightChipTextColor)

            // Apply network theme to Dark mode
            document.documentElement.style.setProperty('--dark-network-button-text-color', colorMap.darkButtonTextColor)
            document.documentElement.style.setProperty('--dark-network-button-color', colorMap.darkButtonColor)
            document.documentElement.style.setProperty('--dark-network-chip-color', colorMap.darkChipColor)
            document.documentElement.style.setProperty('--dark-network-text-accent-color', colorMap.darkTextAccentColor)
            document.documentElement.style.setProperty('--dark-network-border-accent-color', colorMap.darkBorderAccentColor)
            document.documentElement.style.setProperty('--dark-network-graph-bar-color', colorMap.darkGraphBarColor)
            document.documentElement.style.setProperty('--dark-network-chip-text-color', colorMap.darkChipTextColor)
        }
    }
}

export function fetchStringQueryParam(paramName: string, route: RouteLocationNormalizedLoaded): string | null {
    let result: string | null
    const v = route.query[paramName]
    if (typeof v == "string") {
        result = v
    } else {
        result = null
    }
    return result
}

export function fetchNumberQueryParam(paramName: string, route: RouteLocationNormalizedLoaded): number | null {
    let result: number | null
    const v = route.query[paramName]
    if (typeof v == "string") {
        const i = parseInt(v)
        result = isNaN(i) || i < 1 ? null : i
    } else {
        result = null
    }
    return result
}


export class RouteOperator {

    public readonly tabIds: string[] = []
    public readonly tabLabels: string[] = []
    public readonly defaultTabId: string

    constructor(private readonly routeRecord: RouteRecordRaw, private readonly routeManager: RouteManager) {
        for (const c of routeRecord.children ?? []) {
            if (typeof c.name === "string" && typeof c.meta?.tabLabel === "string") {
                this.tabIds.push(c.name)
                this.tabLabels.push(c.meta.tabLabel)
            }
        }
        this.defaultTabId = this.tabIds[0]
    }

    public selectedTabId = computed(() => {
        let result: string|null
        const topMatch = this.routeManager.currentRouteRootMatch.value
        const leafMatch = this.routeManager.currentRouteLeafMatch.value
        if (topMatch !== null && leafMatch !== null && topMatch.name === this.routeRecord.name) {
            result = typeof leafMatch.name === "string" ? leafMatch.name : null
        } else {
            result = null
        }
        return result
    })

    public filterTabIds(excludedTabIds: string | string[]): string[] {
        const x = typeof excludedTabIds === "string" ? [excludedTabIds] : excludedTabIds
        return this.tabIds.filter(tabId => !x.includes(tabId))
    }

    public tabLabel(tabId: string): string|null {
        const tabIndex = this.tabIds.indexOf(tabId)
        return tabIndex != -1 ? this.tabLabels[tabIndex] : null
    }
}


export const routeManager = new RouteManager()
export const walletManager = new WalletManagerV4(routeManager)
export default routeManager.router

