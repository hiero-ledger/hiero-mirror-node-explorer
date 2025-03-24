// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {WalletSession} from "@/utils/wallet/WalletSession";
import {WalletClient} from "@/utils/wallet/client/WalletClient";
import {WalletClient_Hiero} from "@/utils/wallet/client/WalletClient_Hiero";
import {networkToChainId, WalletClient_Ethereum} from "@/utils/wallet/client/WalletClient_Ethereum";
import {EIP1193Provider} from "@/utils/wallet/eip1193";
import {CAAccountId, CAChainId} from "@/utils/wallet/caip";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";
import type SignClient from "@walletconnect/sign-client";
import {ProposalTypes, SessionTypes, SignClientTypes} from "@walletconnect/types";
import {routeManager} from "@/router";
import type {WalletConnectModal} from "@walletconnect/modal"; // "type" to avoid unit test break
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {EntityID} from "@/utils/EntityID";
import {getSdkError} from "@walletconnect/utils";

export class WalletConnectAgent {

    public static readonly WALLET_DN_PREFIX = "wc:"


    //
    // Public
    //

    public static async makeInstance(projectId: string): Promise<WalletConnectAgent | null> {
        let result: WalletConnectAgent | null
        if (projectId !== null) {
            const PRODUCT_NAME = import.meta.env.VITE_APP_PRODUCT_NAME ?? "Hedera Mirror Node Explorer"
            const METADATA: SignClientTypes.Metadata = {
                name: PRODUCT_NAME,
                description: "A ledger explorer for the Hedera network",
                url: window.location.origin,
                icons: [],
            }
            const { SignClient } = await import("@walletconnect/sign-client")
            const signClient = await SignClient.init({
                logger: 'error',
                projectId: projectId,
                // optional parameters
                relayUrl: "wss://relay.walletconnect.com",
                metadata: METADATA
            })
            result = new WalletConnectAgent(signClient, projectId)
        } else {
            result = null
        }
        return result
    }


    public async requestSession(): Promise<WalletSession | null> {

        const network = routeManager.currentNetwork.value
        const params = {
            optionalNamespaces: WalletConnectAgent.makeNamespaces([network])
        }
        const {uri, approval} = await this.signClient.connect(params)
        const {WalletConnectModal} = await import("@walletconnect/modal")
        // https://docs.reown.com/advanced/walletconnectmodal/options
        const connectModal = new WalletConnectModal({
            projectId: this.projectId,
            explorerRecommendedWalletIds: [
                // https://walletguide.walletconnect.network
                "a29498d225fa4b13468ff4d6cf4ae0ea4adcbd95f07ce8a843a1dee10b632f3f", // HashPack
                "a9104b630bac1929ad9ac2a73a17ed4beead1889341f307bff502f89b46c8501", // Blade
                "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // Metamask
                "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
            ]
        })
        const session = await this.waitForApprovalOrModalClose(uri, approval, connectModal)

        const result = session !== null ? await this.makeWalletSession(session) : null

        return Promise.resolve(result)
    }

    public async restoreSession(sessionTopic: string): Promise<WalletSession | null> {
        let result: WalletSession | null

        const session = this.fetchSession(sessionTopic)
        if (session !== null) {
            result = await this.makeWalletSession(session)
        } else {
            result = null
        }

        return Promise.resolve(result)
    }


    //
    // Private
    //

    private constructor(
        private readonly signClient: SignClient,
        private readonly projectId: string) {
    }

    private async makeWalletSession(session: SessionTypes.Struct): Promise<WalletSession> {
        const name = session.peer.metadata.name
        const iconURL = this.fetchIconURL(session)

        const usableAccountSet = new Set<string>()
        const otherAccountSet = new Set<string>()
        for (const ns of Object.values(session.namespaces)) {
            for (const a of ns.accounts) {
                const caId = CAAccountId.parse(a)
                if (caId !== null) {
                    if (caId.chainId.isHedera()) {
                        usableAccountSet.add(caId.accountAddress) // accountAddress is an entity id in that case
                    } else if (caId.chainId.isEIP155()) {
                        const accountAddress = caId.accountAddress
                        const accountInfo = await AccountByAddressCache.instance.lookup(accountAddress)
                        if (accountInfo?.account) {
                            usableAccountSet.add(accountInfo?.account)
                        } else {
                            otherAccountSet.add(accountAddress)
                        }
                    }
                } else {
                    otherAccountSet.add(a)
                }
            }
        }

        const usableAccountIds = Array.from(usableAccountSet).sort(EntityID.compareAccountID)
        const otherAccountIds = Array.from(otherAccountSet).sort()

        const result = new WalletSession_WC(
            this.signClient,
            session,
            name,
            iconURL,
            usableAccountIds,
            otherAccountIds)

        return Promise.resolve(result)
    }

    private fetchSession(sessionTopic: string): SessionTypes.Struct | null {
        let result: SessionTypes.Struct | null = null

        const sessions = this.signClient.session.getAll()
        for (const session of sessions) {
            if (session.topic === sessionTopic) {
                result = session
                break
            }
        }

        return result
    }

    private fetchIconURL(session: SessionTypes.Struct): string | null {
        let result: string | null

        const walletName = session.peer.metadata.name
        const fallbackEntry = WalletConnectAgent.FALLBACK_ICONS.get(walletName) ?? null
        const icons = session.peer.metadata.icons
        let candidate: string | null
        if (icons.length > 0) {
            candidate = icons[0]
        } else {
            candidate = null
        }
        if (fallbackEntry !== null && (candidate === null || candidate === fallbackEntry.buggyURL)) {
            result = fallbackEntry.fallback
        } else {
            result = candidate
        }

        return result
    }

    // Some wallets do not provide icon information => we try to fix
    private static readonly FALLBACK_ICONS = new Map([
        ["MetaMask Wallet", {
            "buggyURL": "",
            fallback: "data:image/png;base64,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"
        }],
        ["Blade Wallet", {
            "buggyURL": "https://www.bladewallet.io/wp-content/uploads/2022/04/Icon.png",
            fallback: "data:image/png;base64,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"
        }]
    ])


    private static makeNamespaces(networks: [string]): ProposalTypes.OptionalNamespaces {
        const hederaChains: string[] = []
        const eip155Chains: string[] = []
        for (const network of networks) {
            hederaChains.push(this.makeCaChainForHedera(network))
            const eip155Chain = this.makeCaChainForEIP155(network)
            if (eip155Chain !== null) {
                eip155Chains.push(eip155Chain)
            }
        }
        return {
            hedera: {
                chains: hederaChains,
                methods: [
                    // "hedera_getNodeAddresses",
                    // "hedera_executeTransaction",
                    // "hedera_signMessage",
                    // "hedera_signAndExecuteQuery",
                    "hedera_signAndExecuteTransaction",
                    // "hedera_signTransaction"
                ],
                events: [
                    'chainChanged',
                    'accountsChanged'
                ]
            },
            eip155: {
                chains: eip155Chains,
                methods: [
                    'eth_sendRawTransaction',
                ],
                events: [
                    'chainChanged',
                    'accountsChanged'
                ]
            },
        }
    }

    private static makeCaChainForHedera(network: string): string {
        return new CAChainId(CAChainId.NAMESPACE_HEDERA, network).toString()
    }

    private static makeCaChainForEIP155(network: string): string | null {
        let result: string | null
        const chainId = routeManager.findChainID(network)
        if (chainId !== null) {
            result = new CAChainId(CAChainId.NAMESPACE_EIP155, chainId.toString()).toString()
        } else {
            result = null
        }
        return result
    }

    private async waitForApprovalOrModalClose(
        uri: string | undefined,
        approval: () => Promise<SessionTypes.Struct>,
        connectModal: WalletConnectModal): Promise<SessionTypes.Struct | null> {

        return new Promise(async (resolve, reject) => {
            connectModal.subscribeModal((state: { open: boolean }) => {
                if (!state.open) {
                    // User has closed the modal without flashing the QR code
                    resolve(null)
                }
            })
            try {
                await connectModal.openModal({uri})
                resolve(await approval())
            } catch (reason) {
                reject(reason)
            } finally {
                connectModal.closeModal()
            }
        })
    }
}


class WalletSession_WC extends WalletSession {

    constructor(private readonly signClient: SignClient,
                private readonly session: SessionTypes.Struct,
                name: string,
                iconURL: string | null,
                usableAccountIds: string[],
                otherAccountIds: string[]) {
        super(name, iconURL, usableAccountIds, otherAccountIds)
    }

    //
    // WalletSession
    //

    public async makeClient(accountId: string): Promise<WalletClient | null> {
        let result: WalletClient | null
        const caAccountId = await this.findCaAccountId(accountId)
        if (caAccountId !== null) {
            const caChainId = caAccountId.chainId
            const provider = new Provider_WC(this.signClient, this.session, caChainId)
            if (caChainId.isHedera()) {
                result = new WalletClient_Hiero(accountId, routeManager.currentNetwork.value, provider)
            } else if (caChainId.isEIP155()) {
                result = new WalletClient_Ethereum(accountId, routeManager.currentNetwork.value, provider)
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    }

    public async revoke(): Promise<void> {
        await this.signClient.disconnect({
            topic: this.session.topic,
            reason: getSdkError('USER_DISCONNECTED')
        })
    }

    public getWalletDN(): string {
        return "wc:" + this.session.topic
    }

    public getWalletUUID(): string | null {
        return null
    }

    //
    // Private
    //

    private async findCaAccountId(accountId: string): Promise<CAAccountId | null> {
        let result: CAAccountId | null
        const hederaCAAccountId = this.makeCAAccountIdForHedera(accountId)
        if (this.sessionContains(hederaCAAccountId)) {
            result = hederaCAAccountId
        } else {
            const accountAddress = await AccountByIdCache.instance.findAccountAddress(accountId)
            if (accountAddress !== null) {
                const eip155CaAccountId = this.makeCAAccountIdForEIP155(accountAddress)
                if (eip155CaAccountId !== null && this.sessionContains(eip155CaAccountId)) {
                    result = eip155CaAccountId
                } else {
                    result = null
                }
            } else {
                result = null
            }
        }
        return Promise.resolve(result)
    }

    private sessionContains(caAccountId: CAAccountId): boolean {
        const idStr = caAccountId.toString()
        for (const ns of Object.values(this.session.namespaces)) {
            for (const a of ns.accounts) {
                if (a === idStr) {
                    return true
                }
            }
        }
        return false
    }

    private makeCAAccountIdForHedera(accountId: string): CAAccountId {
        const network = routeManager.currentNetwork.value
        const caChainId = new CAChainId(CAChainId.NAMESPACE_HEDERA, network)
        return new CAAccountId(caChainId, accountId)
    }

    private makeCAAccountIdForEIP155(accountAddress: string): CAAccountId | null {
        const chainId = networkToChainId(routeManager.currentNetwork.value, false)
        const caChainId = chainId !== null ? new CAChainId(CAChainId.NAMESPACE_EIP155, chainId) : null
        return caChainId !== null ? new CAAccountId(caChainId, accountAddress) : null
    }
}


class Provider_WC implements EIP1193Provider {

    public constructor(private readonly signClient: SignClient,
                       private readonly session: SessionTypes.Struct,
                       private readonly caChainId: CAChainId) {
    }

    //
    // EIP1193Provider
    //

    request(request: { method: string, params?: Array<unknown> } | object): Promise<unknown> {
        const requestParams = {
            topic: this.session.topic,
            request: request as any,
            chainId: this.caChainId.toString()
        }
        return this.signClient.request(requestParams)
        // console.log("requestParams=" + JSON.stringify(requestParams, null, 2))
        // return this.signClient.request(requestParams)
        //     .catch((reason: unknown) => {
        //         console.log("reason=" + JSON.stringify(reason))
        //         throw reason
        //     })
    }

}
