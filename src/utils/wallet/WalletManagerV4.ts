// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0


import {computed, ref, watch} from "vue";
import {WalletClient, WalletClientError} from "@/utils/wallet/client/WalletClient";
import {WalletClient_Hiero} from "@/utils/wallet/client/WalletClient_Hiero";
import {WalletClient_Ethereum} from "@/utils/wallet/client/WalletClient_Ethereum";
import {WalletConnectAgent} from "@/utils/wallet/WalletConnectAgent";
import {EIP6963Agent} from "@/utils/wallet/EIP6963Agent";
import {WalletSession} from "@/utils/wallet/WalletSession";
import {AppStorage} from "@/AppStorage";
import {RouteManager} from "@/utils/RouteManager";
import {ContractResultDetails, TokenAirdrop} from "@/schemas/MirrorNodeSchemas";
import {AccountUpdateTransaction, TokenRejectTransaction} from "@hashgraph/sdk";

export enum WalletManagerStatus {
    disabled,
    initializing,
    disconnected,
    connecting,
    connected,
    restoring
}

export class WalletManagerV4 {

    private readonly initializing = ref(false)
    private readonly restoring = ref(false)
    private readonly connecting = ref(false)
    private readonly walletSession = ref<WalletSession | null>(null)
    public readonly accountId = ref<string | null>(null)
    public readonly client = ref<WalletClient | null>(null)
    private walletConnectAgent: WalletConnectAgent | null = null

    //
    // Public
    //

    public constructor(private readonly routeManager: RouteManager) {
    }

    public launch(): void {
        this.initialize().catch()
    }

    public readonly status = computed<WalletManagerStatus>(() => {
        let result: WalletManagerStatus

        if (this.walletCount.value === 0) {
            result = WalletManagerStatus.disabled
        } else if (this.initializing.value) {
            result = WalletManagerStatus.initializing
        } else if (this.connecting.value) {
            result = WalletManagerStatus.connecting
        } else if (this.restoring.value) {
            result = WalletManagerStatus.restoring
        } else {
            result = this.walletSession.value !== null ? WalletManagerStatus.connected : WalletManagerStatus.disconnected
        }

        return result
    })

    public readonly walletName
        = computed(() => this.walletSession.value?.name ?? null)

    public readonly walletIconURL
        = computed<string | null>(() => this.walletSession.value?.iconURL ?? null)

    public readonly walletDN
        = computed<string | null>(() => this.walletSession.value?.getWalletDN() ?? null)

    public readonly walletUUID
        = computed<string | null>(() => this.walletSession.value?.getWalletUUID() ?? null)

    public readonly accountIds
        = computed<string[]>(() => this.walletSession.value?.usableAccountIds ?? [])

    public readonly isHieroWallet
        = computed(() => this.client.value instanceof WalletClient_Hiero)

    public readonly isEthereumWallet
        = computed(() => this.client.value instanceof WalletClient_Ethereum)

    public readonly isMetamaskWallet = computed(() => {
        const walletName = this.walletName.value
        const re = new RegExp("metamask", "i")
        return walletName !== null && re.test(walletName)
    })

    public readonly isWatchSupported
        = computed(() => this.isMetamaskWallet.value)

    public readonly walletCount = computed(() => {
        let result = EIP6963Agent.instance.providers.value.length
        if (this.routeManager.walletConnectID.value !== null) {
            result += 1
        }
        return result
    })

    public async connect(walletUUID: string | null): Promise<boolean> {

        // Updates this.walletSession
        if (walletUUID === null) {
            // Connection through WalletConnect
            if (this.walletConnectAgent !== null) {
                try {
                    this.walletSession.value = await this.walletConnectAgent.requestSession()
                } catch (error) {
                    this.traceError(error, "WalletManagerV4.connect()")
                    this.walletSession.value = null
                }
            } else {
                // WalletConnectAgent.makeInstance() did fail => browser setup does not allow WalletConnect to work
                this.walletSession.value = null
                throw new WalletConnectDisableByBrowserError()
            }
        } else {
            // Connection through browser extension
            try {
                this.walletSession.value = await EIP6963Agent.instance.restoreSession(walletUUID)
                if (this.walletSession.value === null) {
                    this.walletSession.value = await EIP6963Agent.instance.requestSession(walletUUID)
                }
            } catch (error) {
                this.traceError(error, "WalletManagerV4.connect()")
                this.walletSession.value = null
                throw error
            }
        }

        // Updates this.accountId
        if (this.walletSession.value !== null) {
            const usableAccountIds = this.walletSession.value.usableAccountIds
            this.accountId.value = usableAccountIds.length >= 1 ? usableAccountIds[0] : null
        } else {
            this.accountId.value = null
        }

        // Updates this.client
        await this.updateClient()

        // Saves to local storage
        const network = this.routeManager.currentNetwork.value
        if (this.walletSession.value !== null) {
            AppStorage.setWalletDN(this.walletSession.value.getWalletDN(), network)
            AppStorage.setWalletAccountId(this.accountId.value, network)
        } else {
            AppStorage.setWalletDN(null, network)
            AppStorage.setWalletAccountId(null, network)
        }

        return this.walletSession.value !== null
    }

    public async disconnect(): Promise<void> {
        // Updates this.walletSession
        if (this.walletSession.value !== null) {
            try {
                await this.walletSession.value.revoke()
            } catch (error) {
                this.traceError(error, "WalletManagerV4.disconnect()")
            }
            this.walletSession.value = null
        }

        // Updates this.accountId
        this.accountId.value = null

        // Saves to local storage
        const network = this.routeManager.currentNetwork.value
        AppStorage.setWalletDN(null, network)
        AppStorage.setWalletAccountId(null, network)
    }

    public selectAccountId(accountId: string): void {
        if (this.accountIds.value.indexOf(accountId) != -1) {
            this.accountId.value = accountId

            // Saves to local storage
            const network = this.routeManager.currentNetwork.value
            AppStorage.setWalletAccountId(this.accountId.value, network)
        }
    }

    //
    // Public (transactions)
    //

    public async associateToken(tokenId: string): Promise<string> {
        if (this.client.value !== null) {
            return await this.client.value.associateToken(tokenId)
        } else {
            throw "bug"
        }
    }

    public async dissociateToken(tokenId: string): Promise<string> {
        if (this.client.value !== null) {
            return await this.client.value.dissociateToken(tokenId)
        } else {
            throw "bug"
        }
    }

    public async callContract(contractId: string, functionData: string): Promise<ContractResultDetails | string> {
        if (this.client.value !== null) {
            return await this.client.value.callContract(contractId, functionData)
        } else {
            throw "bug"
        }
    }

    public async rejectTokens(transaction: TokenRejectTransaction): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.rejectTokens(transaction)
        } else {
            throw "bug"
        }
    }

    public async changeStaking(stakedNodeId: number | null, stakedAccountId: string | null, declineReward: boolean | null): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.changeStaking(stakedNodeId, stakedAccountId, declineReward)
        } else {
            throw "bug"
        }
    }

    public async approveHbarAllowance(spender: string, amount: number): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.approveHbarAllowance(spender, amount)
        } else {
            throw "bug"
        }
    }

    public async approveTokenAllowance(token: string, spender: string, amount: number): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.approveTokenAllowance(token, spender, amount)
        } else {
            throw "bug"
        }
    }

    public async approveNFTAllowance(token: string, spender: string, serialNumbers: number[]): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.approveNFTAllowance(token, spender, serialNumbers)
        } else {
            throw "bug"
        }
    }

    public async deleteNftAllowance(token: string, serialNumber: number): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.deleteNftAllowance(token, serialNumber)
        } else {
            throw "bug"
        }
    }

    public async deleteNftAllSerialsAllowance(token: string, spender: string): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.deleteNftAllSerialsAllowance(token, spender)
        } else {
            throw "bug"
        }
    }

    public async updateAccount(transaction: AccountUpdateTransaction): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.updateAccount(transaction)
        } else {
            throw "bug"
        }
    }

    public async claimTokenAirdrops(airdrops: TokenAirdrop[]): Promise<string> {
        if (this.client.value instanceof WalletClient_Hiero) {
            return await this.client.value.claimTokenAirdrops(airdrops)
        } else {
            throw "bug"
        }
    }

    public async watchToken(tokenId: string, serialNumber?: string): Promise<void> {
        if (this.client.value instanceof WalletClient_Ethereum) {
            await this.client.value.watchToken(tokenId, serialNumber)
        } else {
            throw "bug"
        }
    }


    //
    // Private
    //

    private async initialize(): Promise<void> {
        this.initializing.value = true
        await this.initWalletConnect()
        this.initializing.value = false
        watch(this.routeManager.currentNetwork, async () => {
            this.restoring.value = true
            await this.restoreLastSession()
            this.restoring.value = false
        }, {immediate: true})
    }

    private async initWalletConnect(): Promise<void> {
        const walletConnectID = this.routeManager.walletConnectID.value
        if (walletConnectID !== null) {
            try {
                this.walletConnectAgent = await WalletConnectAgent.makeInstance(walletConnectID)
            } catch (error) {
                // this.traceError(error, "WalletManagerV4.initWalletConnect()")
                this.walletConnectAgent = null
            }
        } else {
            this.walletConnectAgent = null
        }
    }

    private async restoreLastSession(): Promise<void> {

        // Restores this.walletSession
        const network = this.routeManager.currentNetwork.value
        const walletDN = AppStorage.getWalletDN(network)
        if (walletDN !== null) {
            if (walletDN.startsWith(WalletConnectAgent.WALLET_DN_PREFIX)) {
                // Last access used wallet connect
                const sessionTopic = walletDN.slice(WalletConnectAgent.WALLET_DN_PREFIX.length)
                if (this.walletConnectAgent !== null) {
                    try {
                        this.walletSession.value = await this.walletConnectAgent.restoreSession(sessionTopic)
                    } catch (error) {
                        this.traceError(error, "WalletManagerV4.connect()")
                        this.walletSession.value = null
                    }
                } else {
                    this.walletSession.value = null
                }
            } else if (walletDN.startsWith(EIP6963Agent.WALLET_DN_PREFIX)) {
                // Last access used wallet extension
                const providerRDN = walletDN.slice(EIP6963Agent.WALLET_DN_PREFIX.length)
                try {
                    this.walletSession.value = await EIP6963Agent.instance.checkAccessWithRDN(providerRDN)
                } catch (error) {
                    this.traceError(error, "WalletManagerV4.restoreLastAccess()")
                    this.walletSession.value = null
                }
            } else {
                this.walletSession.value = null
            }
        } else {
            this.walletSession.value = null
        }

        // Restores this.accountId
        if (this.walletSession.value !== null) {
            const walletAccountId = AppStorage.getWalletAccountId(network)
            if (walletAccountId !== null && this.accountIds.value.indexOf(walletAccountId) != -1) {
                this.accountId.value = walletAccountId
            } else {
                this.accountId.value = this.accountIds.value.length >= 1 ? this.accountIds.value[0] : null
            }
        } else {
            this.accountId.value = null
        }

        await this.updateClient()
    }

    private async updateClient(): Promise<void> {
        if (this.walletSession.value !== null && this.accountId.value !== null) {
            this.client.value = await this.walletSession.value.makeClient(this.accountId.value)
        } else {
            this.client.value = null
        }
    }

    private traceError(reason: unknown, caller: string): void {
        console.trace(caller + " caught error: " + JSON.stringify(reason))
    }
}

export class WalletConnectDisableByBrowserError extends WalletClientError {

    public constructor() {
        super("Browser setup does not allow to use WalletConnect right now", "Check that cookies are enabled")
    }
}

