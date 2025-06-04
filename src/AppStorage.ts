// SPDX-License-Identifier: Apache-2.0

import {NameRecord} from "@/utils/name_service/NameService";
import {ref} from "vue";

export class AppStorage {

    private static readonly VERSION = "v1"

    //
    // dark vs. light theme
    //
    private static readonly THEME_KEY = 'theme'

    public static getTheme(): string | null {
        return this.getLocalStorageItem(this.THEME_KEY)
    }

    public static setTheme(newValue: string | null): void {
        this.setLocalStorageItem(this.THEME_KEY, newValue)
    }

    //
    // network
    //

    private static readonly LAST_USED_NETWORK_KEY = 'network'

    public static getLastNetwork(): string | null {
        return this.getLocalStorageItem(this.LAST_USED_NETWORK_KEY)
    }

    public static setLastNetwork(newValue: string | null): void {
        this.setLocalStorageItem(this.LAST_USED_NETWORK_KEY, newValue)
    }

    //
    // skip disclaimer (wallet chooser)
    //

    private static readonly DISCLAIMER_SKIP_KEY = 'skipDisclaimer'

    public static getSkipDisclaimer(): boolean {
        return this.getLocalStorageItem(this.DISCLAIMER_SKIP_KEY) != null
    }

    public static setSkipDisclaimer(newValue: boolean | null): void {
        this.setLocalStorageItem(this.DISCLAIMER_SKIP_KEY, newValue ? "true" : null)
    }

    //
    // contract logs table page size
    //

    private static readonly CONTRACT_LOGS_TABLE_PAGE_SIZE_KEY = 'logsPageSize'

    public static getLogsTablePageSize(): number | null {
        const size = this.getLocalStorageItem(this.CONTRACT_LOGS_TABLE_PAGE_SIZE_KEY)
        return size ? Number(size) : null
    }

    public static setLogsTablePageSize(newValue: number | null): void {
        this.setLocalStorageItem(this.CONTRACT_LOGS_TABLE_PAGE_SIZE_KEY, newValue ? newValue?.toString() : null)
    }

    //
    // contract states table page size
    //

    private static readonly CONTRACT_STATES_TABLE_PAGE_SIZE_KEY = 'statesPageSize'

    public static getStatesTablePageSize(): number | null {
        const size = this.getLocalStorageItem(this.CONTRACT_STATES_TABLE_PAGE_SIZE_KEY)
        return size ? Number(size) : null
    }

    public static setStatesTablePageSize(newValue: number | null): void {
        this.setLocalStorageItem(this.CONTRACT_STATES_TABLE_PAGE_SIZE_KEY, newValue ? newValue?.toString() : null)
    }

    //
    // Table page size (generic)
    //

    public static readonly TRANSFER_TABLE_PAGE_SIZE_KEY = 'transferPageSize'
    public static readonly BOTTOM_DASHBOARD_TABLE_PAGE_SIZE_KEY = 'bottomDashboardPageSize'

    public static readonly TRANSACTION_TABLE_PAGE_SIZE_KEY = 'transactionPageSize'

    public static readonly TOKEN_TABLE_PAGE_SIZE_KEY = 'tokenPageSize'
    public static readonly TOKEN_BALANCE_TABLE_PAGE_SIZE_KEY = 'tokenBalancePageSize'
    public static readonly NFT_HOLDER_TABLE_PAGE_SIZE_KEY = 'nftHolderPageSize'
    public static readonly NFT_TRANSACTION_TABLE_PAGE_SIZE_KEY = 'nftTransactionTablePageSize'

    public static readonly TOPIC_TABLE_PAGE_SIZE_KEY = 'topicPageSize'
    public static readonly TOPIC_MESSAGE_TABLE_PAGE_SIZE_KEY = 'topicMessagePageSize'

    public static readonly CONTRACT_TABLE_PAGE_SIZE_KEY = 'contractPageSize'
    public static readonly RECENT_CALL_TABLE_PAGE_SIZE_KEY = 'recentCallPageSize'

    public static readonly ACCOUNT_TABLE_PAGE_SIZE_KEY = 'accountPageSize'
    public static readonly ACCOUNT_OPERATION_TABLE_PAGE_SIZE_KEY = 'accountOperationPageSize'
    public static readonly ALLOWANCE_TABLE_PAGE_SIZE_KEY = 'allowancePageSize'
    public static readonly STAKING_TABLE_PAGE_SIZE_KEY = 'stakingPageSize'
    public static readonly ACCOUNT_TOKENS_TABLE_PAGE_SIZE_KEY = 'accountTokensPageSize'

    public static readonly BLOCK_TABLE_PAGE_SIZE_KEY = 'blockPageSize'
    public static readonly BLOCK_TRANSACTION_TABLE_PAGE_SIZE_KEY = 'blockTransactionPageSize'

    public static readonly ERC_TOKEN_TABLE_PAGE_SIZE_KEY = 'ercTokenTablePageSize'
    public static readonly ERC_TOKEN_HOLDER_TABLE_PAGE_SIZE_KEY = 'ercTokenHolderTablePageSize'

    public static getTablePageSize(key: string): number | null {
        const size = this.getLocalStorageItem(key)
        return size ? Number(size) : null
    }

    public static setTablePageSize(key: string, newValue: number | null): void {
        this.setLocalStorageItem(key, newValue ? newValue?.toString() : null)
    }

    //
    // cookiePolicy
    //

    private static readonly COOKIE_POLICY_NAME = 'cookie_policy'
    private static readonly COOKIE_POLICY_ACCEPT = 'accept'
    private static readonly COOKIE_POLICY_REJECT = 'reject'
    private static readonly COOKIE_POLICY_VALIDITY = 365 // days

    public static getAcceptCookiePolicy(): boolean | null {
        const policy = AppStorage.readCookie(AppStorage.COOKIE_POLICY_NAME)
        return policy != null ? policy === AppStorage.COOKIE_POLICY_ACCEPT : null
    }

    public static setAcceptCookiePolicy(accept: boolean): void {
        const policy = accept ? AppStorage.COOKIE_POLICY_ACCEPT : AppStorage.COOKIE_POLICY_REJECT
        AppStorage.createCookie(AppStorage.COOKIE_POLICY_NAME, policy, AppStorage.COOKIE_POLICY_VALIDITY)
    }

    //
    // display hexa opcodes in assembly code
    //

    private static readonly SHOW_HEXA_OPCODE_KEY = 'hexaOpcode'

    public static getShowHexaOpcode(): boolean {
        return this.getLocalStorageItem(this.SHOW_HEXA_OPCODE_KEY) != null
    }

    public static setShowHexaOpcode(newValue: boolean | null): void {
        this.setLocalStorageItem(this.SHOW_HEXA_OPCODE_KEY, newValue ? "true" : null)
    }

    //
    // display allowances "Approved for all" in AllowanceSection
    //

    private static readonly SELECT_APPROVED_FOR_ALL_KEY = 'approvedForAll'

    public static getSelectApprovedForAll(): boolean {
        return this.getLocalStorageItem(this.SELECT_APPROVED_FOR_ALL_KEY) != null
    }

    public static setSelectApprovedForAll(newValue: boolean | null): void {
        this.setLocalStorageItem(this.SELECT_APPROVED_FOR_ALL_KEY, newValue ? "true" : null)
    }

    //
    // sections collapsed state
    //

    private static readonly COLLAPSED_STATE_KEY = 'collapsed'

    public static getCollapsedState(section: string): boolean | null {
        const collapsed = this.getLocalStorageItem(`${section}_${this.COLLAPSED_STATE_KEY}`)
        return collapsed ? collapsed === 'true' : null
    }

    public static setCollapsedState(section: string, collapsed: boolean | null): void {
        this.setLocalStorageItem(`${section}_${this.COLLAPSED_STATE_KEY}`, collapsed != null ? (collapsed ? "true" : "false") : null)
    }

    //
    // preferred tab in account operations section
    //

    private static readonly ACCOUNT_OPERATION_TAB_KEY = 'accountOperationTab'

    public static getAccountOperationTab(): string | null {
        return this.getLocalStorageItem(this.ACCOUNT_OPERATION_TAB_KEY)
    }

    public static setAccountOperationTab(newValue: string | null): void {
        this.setLocalStorageItem(this.ACCOUNT_OPERATION_TAB_KEY, newValue)
    }

    //
    // preferred tab in account allowances section
    //

    private static readonly ACCOUNT_ALLOWANCE_TAB_KEY = 'accountAllowanceTab'

    static getAccountAllowanceTab() {
        return this.getLocalStorageItem(this.ACCOUNT_ALLOWANCE_TAB_KEY)
    }

    static setAccountAllowanceTab(newValue: string | null) {
        this.setLocalStorageItem(this.ACCOUNT_ALLOWANCE_TAB_KEY, newValue)
    }

    //
    // preferred tabs in account tokens section
    //

    private static readonly ACCOUNT_TOKEN_TAB_KEY = 'accountTokenTab'
    private static readonly ACCOUNT_AIRDROP_TAB_KEY = 'accountAirdropTab'

    static getAccountTokenTab() {
        return this.getLocalStorageItem(this.ACCOUNT_TOKEN_TAB_KEY)
    }

    static setAccountTokenTab(newValue: string | null) {
        this.setLocalStorageItem(this.ACCOUNT_TOKEN_TAB_KEY, newValue)
    }

    static getAccountAirdropTab() {
        return this.getLocalStorageItem(this.ACCOUNT_AIRDROP_TAB_KEY)
    }

    static setAccountAirdropTab(newValue: string | null) {
        this.setLocalStorageItem(this.ACCOUNT_AIRDROP_TAB_KEY, newValue)
    }

    //
    // preferred tab in contract bytecode section
    //

    private static readonly CONTRACT_BYTECODE_TAB_KEY = 'contractBytecodeTab'

    public static getContractByteCodeTab(): string | null {
        return this.getLocalStorageItem(this.CONTRACT_BYTECODE_TAB_KEY)
    }

    public static setContractByteCodeTab(newValue: string | null): void {
        this.setLocalStorageItem(this.CONTRACT_BYTECODE_TAB_KEY, newValue)
    }

    //
    // input params (for abi section)
    //

    private static readonly INPUT_PARAMS = 'inputParams'

    public static getInputParam(functionHash: string, paramName: string): unknown | null {
        const jsonText = this.getLocalStorageItem(this.makeInputParamKey(functionHash, paramName))
        let result: unknown | null
        if (jsonText !== null) {
            try {
                result = JSON.parse(jsonText)
            } catch {
                result = null
            }
        } else {
            result = null
        }
        return result
    }

    public static setInputParam(newValue: unknown | null, functionHash: string, paramName: string) {
        const jsonText = newValue !== null ? JSON.stringify(newValue) : null
        this.setLocalStorageItem(this.makeInputParamKey(functionHash, paramName), jsonText)
    }

    private static makeInputParamKey(functionHash: string, paramName: string): string {
        return this.INPUT_PARAMS + "/" + functionHash + "/" + paramName
    }

    //
    // selected fragment type in ABI tab
    //

    private static readonly FRAGMENT_COLLECTION_KEY = 'fragmentCollection'

    public static getFragmentCollection(): string | null {
        return this.getLocalStorageItem(this.FRAGMENT_COLLECTION_KEY)
    }

    public static setFragmentCollection(newValue: string | null): void {
        this.setLocalStorageItem(this.FRAGMENT_COLLECTION_KEY, newValue)
    }

    //
    // show logic  ABI
    //

    private static readonly SHOW_LOGIC_ABI_KEY = 'showLogicABI'

    public static getShowLogicABI(): boolean {
        return this.getLocalStorageItem(this.SHOW_LOGIC_ABI_KEY) !== null
    }

    public static setShowLogicABI(newValue: boolean): void {
        this.setLocalStorageItem(this.SHOW_LOGIC_ABI_KEY, newValue ? "true" : null)
    }

    //
    // use arobas form of Transaction ID
    //

    private static readonly USE_DASH_FORM_KEY = 'useDashForm'

    public static getUseDashForm(): boolean {
        return this.getLocalStorageItem(this.USE_DASH_FORM_KEY) !== null
    }

    public static setUseDashForm(newValue: boolean): void {
        this.setLocalStorageItem(this.USE_DASH_FORM_KEY, newValue ? "true" : null)
    }

    //
    // wallet
    //

    private static readonly WALLET_DN = 'walletDN'

    public static getWalletDN(network: string): string | null {
        return this.getLocalStorageItem(this.makeWalletDNKey(network))
    }

    public static setWalletDN(newValue: string | null, network: string) {
        this.setLocalStorageItem(this.makeWalletDNKey(network), newValue)
    }

    private static makeWalletDNKey(network: string): string {
        return this.WALLET_DN + "/" + network
    }

    //
    // wallet account id
    //

    private static readonly WALLET_ACCOUNT_ID = 'walletAccountId'

    public static getWalletAccountId(network: string): string | null {
        return this.getLocalStorageItem(this.makeWalletAccountIdKey(network))
    }

    public static setWalletAccountId(newValue: string | null, network: string) {
        this.setLocalStorageItem(this.makeWalletAccountIdKey(network), newValue)
    }

    private static makeWalletAccountIdKey(network: string): string {
        return this.WALLET_ACCOUNT_ID + "/" + network
    }

    //
    // minimum transfer value for filtering 'spam' CRYPTO TRANSFER transactions
    //

    private static readonly MIN_TINYBAR_TRANSFER_KEY = 'minTinyBarTransfer'

    public static getMinTinyBarTransfer(): number | null {
        const size = this.getLocalStorageItem(this.MIN_TINYBAR_TRANSFER_KEY)
        return size ? Number(size) : null
    }

    public static setMinTinyBarTransfer(newValue: number | null): void {
        this.setLocalStorageItem(this.MIN_TINYBAR_TRANSFER_KEY, newValue ? newValue?.toString() : null)
    }

    //
    // Private
    //

    private static getLocalStorageItem(keySuffix: string): string | null {
        let result: string | null
        try {
            result = localStorage.getItem(AppStorage.VERSION + "/" + keySuffix)
        } catch {
            result = null
        }
        return result
    }

    private static setLocalStorageItem(keySuffix: string, value: string | null) {
        const key = AppStorage.VERSION + "/" + keySuffix
        try {
            if (value != null) {
                localStorage.setItem(key, value);
            } else {
                localStorage.removeItem(key);
            }
        } catch {
            // Ignored
        }
    }

    //
    // cookies
    // from routines provided at https://www.quirksmode.org/js/cookies.html
    //

    private static createCookie(name: string, value: string, days: number): void {
        let expires
        if (days) {
            const date = new Date()
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
            expires = `; expires=${date.toUTCString()}`
        } else {
            expires = ""
        }
        document.cookie = `${name}=${value}${expires}; path=/`
    }

    private static readCookie(name: string): string | null {
        let result = null
        const nameEQ = name + "="
        const ca = document.cookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length)
            }
            if (c.indexOf(nameEQ) == 0) {
                result = c.substring(nameEQ.length, c.length)
                break
            }
        }
        return result
    }

    //
    // name resolution
    //

    private static readonly NAMING = "naming"

    public static getNameRecord(entityId: string, network: string): NameRecord | null {
        const key = this.makeNamingKey(entityId, network)
        const jsonText = this.getLocalStorageItem(key)
        let result: unknown | null
        if (jsonText !== null) {
            try {
                result = JSON.parse(jsonText)
            } catch {
                result = null
            }
        } else {
            result = null
        }
        return result as NameRecord | null
    }

    public static setNameRecord(entityId: string, network: string, newRecord: NameRecord): void {
        const jsonText = JSON.stringify(newRecord)
        this.setLocalStorageItem(this.makeNamingKey(entityId, network), jsonText)
        this.nameRecordChangeCounter.value += 1
    }

    public static clearNameRecord(entityId: string, network: string): void {
        this.setLocalStorageItem(this.makeNamingKey(entityId, network), null)
        this.nameRecordChangeCounter.value += 1
    }

    public static readonly nameRecordChangeCounter = ref(0)

    private static makeNamingKey(entityId: string, network: string): string {
        return this.NAMING + "/" + network + "/" + entityId
    }
}
