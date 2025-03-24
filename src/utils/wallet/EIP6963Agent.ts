// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {shallowRef} from "vue";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {WalletSession} from "@/utils/wallet/WalletSession";
import {WalletClient} from "@/utils/wallet/client/WalletClient";
import {HEDERA_LOGO, networkToChainId, WalletClient_Ethereum} from "@/utils/wallet/client/WalletClient_Ethereum";
import {routeManager} from "@/router";
import {EIP6963AnnounceProviderEvent, EIP6963ProviderDetail} from "@/utils/wallet/eip6963";
import {
    AddEthereumChainParameter,
    eth_accounts,
    eth_chainId,
    eth_isUnsupportedMethod,
    eth_isUserReject,
    eth_requestAccounts,
    wallet_addEthereumChain,
    wallet_revokePermissions,
    wallet_switchEthereumChain
} from "@/utils/wallet/eip1193";


export class EIP6963Agent {

    public static readonly instance = new EIP6963Agent()

    public readonly providers = shallowRef<EIP6963ProviderDetail[]>([])

    public static readonly WALLET_DN_PREFIX = "eip6963:"

    //
    // Public
    //

    public async requestSession(providerUUID: string): Promise<WalletSession | null> {
        let result: WalletSession | null

        const d = this.findProviderDetails(providerUUID)
        if (d !== null) {
            // 1) Checks current chain and tries to setup if needed
            try {
                if (!await this.isChainOK(d)) {
                    await this.trySetupChain(d)
                }
            } catch (error) {
                // Let's go forward and try the remaining steps… :/
            }
            // 2) Creates session
            try {
                const accountAddresses = await eth_requestAccounts(d.provider)
                const usableAccountIds: string[] = []
                const otherAccounts: string[] = []
                for (const a of accountAddresses) {
                    const accountInfo = await AccountByAddressCache.instance.lookup(a)
                    if (accountInfo !== null && accountInfo.account !== null) {
                        usableAccountIds.push(accountInfo.account)
                    } else {
                        otherAccounts.push(a)
                    }
                }
                result = new WalletSession_EIP6963(d, d.info.name, d.info.icon, usableAccountIds, otherAccounts)
            } catch (reason) {
                if (eth_isUserReject(reason)) {
                    result = null
                } else {
                    throw reason
                }
            }
        } else {
            result = null
        }

        return Promise.resolve(result)
    }

    public async restoreSession(providerUUID: string): Promise<WalletSession | null> {
        let result: WalletSession | null

        const d = this.findProviderDetails(providerUUID)
        if (d !== null) {
            const accountAddresses = await eth_accounts(d.provider)
            const usableAccountIds: string[] = []
            const otherAccounts: string[] = []
            for (const a of accountAddresses) {
                const accountInfo = await AccountByAddressCache.instance.lookup(a)
                if (accountInfo !== null && accountInfo.account !== null) {
                    usableAccountIds.push(accountInfo.account)
                } else {
                    otherAccounts.push(a)
                }
            }
            if (usableAccountIds.length >= 1) {
                result = new WalletSession_EIP6963(d, d.info.name, d.info.icon, usableAccountIds, otherAccounts)
            } else {
                result = null
            }
        } else {
            result = null
        }

        return Promise.resolve(result)
    }

    public async checkAccessWithRDN(providerRDN: string): Promise<WalletSession | null> {
        const d = this.providers.value.find((d: EIP6963ProviderDetail) => d.info.rdns === providerRDN) ?? null
        return d !== null ? this.restoreSession(d.info.uuid) : null
    }

    public async revokeAccess(providerUUID: string): Promise<boolean> {
        let result: boolean
        const d = this.findProviderDetails(providerUUID)
        if (d !== null) {
            try {
                await wallet_revokePermissions(d.provider)
                result = true
            } catch (reason) {
                if (eth_isUnsupportedMethod(reason)) {
                    result = false
                } else {
                    throw reason
                }
            }
        } else {
            result = false
        }
        return Promise.resolve(result)
    }

    //
    // Private
    //

    private constructor() {
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-6963.md#dapp-implementation

        window.addEventListener("eip6963:announceProvider", this.handleAnnounceProvider)
        window.dispatchEvent(new Event("eip6963:requestProvider"))
    }

    private readonly handleAnnounceProvider = (event: EIP6963AnnounceProviderEvent): void => {
        const newUUID = event.detail.info.uuid
        const match = this.providers.value.find((d: EIP6963ProviderDetail) => d.info.uuid == newUUID)
        if (match) {
            console.log("Ignoring EIP6963 event for " + match.info.name)
        } else {
            this.providers.value.push(event.detail)
        }
    }

    private findProviderDetails(uuid: string): EIP6963ProviderDetail | null {
        const result = this.providers.value.find((d: EIP6963ProviderDetail) => d.info.uuid === uuid) ?? null
        if (result === null) {
            console.log("No provider found for UUID: " + uuid)
        }
        return result
    }

    private async isChainOK(d: EIP6963ProviderDetail): Promise<boolean> {
        const targetChainId = networkToChainId(routeManager.currentNetwork.value)
        const currentChainId = await eth_chainId(d.provider)
        return targetChainId == currentChainId
    }

    private async trySetupChain(d: EIP6963ProviderDetail): Promise<void> {

        // Try to switch
        const network = routeManager.currentNetwork.value
        const chainId = networkToChainId(network)
        if (chainId !== null) {
            try {
                await wallet_switchEthereumChain(d.provider, chainId)
            } catch {
                // Let's ignore and try to add chain
            }
        }

        // Check again and try to add
        if (!await this.isChainOK(d)) {
            const chainParam = this.makeChainParam(network)
            if (chainParam !== null) {
                await wallet_addEthereumChain(d.provider, chainParam)
            }
        }
    }

    private makeChainParam(network: string): AddEthereumChainParameter | null {
        let result: AddEthereumChainParameter | null

        switch (network) {
            case "mainnet":
                result = CHAIN_PARAM_MAINNET
                break
            case "testnet":
                result = CHAIN_PARAM_TESTNET
                break
            case "previewnet":
                result = CHAIN_PARAM_PREVIEWNET
                break
            default:
                result = null
                break
        }
        return result
    }

}


class WalletSession_EIP6963 extends WalletSession {

    constructor(public providerDetails: EIP6963ProviderDetail,
                name: string,
                iconURL: string | null,
                usableAccountIds: string[],
                otherAccountIds: string[]) {
        super(name, iconURL, usableAccountIds, otherAccountIds)
    }

    //
    // WalletSession
    //

    public makeClient(accountId: string): Promise<WalletClient | null> {
        const result = new WalletClient_Ethereum(accountId,
            routeManager.currentNetwork.value, this.providerDetails.provider)
        return Promise.resolve(result)
    }

    public async revoke(): Promise<void> {
        await EIP6963Agent.instance.revokeAccess(this.providerDetails.info.uuid)
    }

    public getWalletDN(): string {
        return "eip6963:" + this.providerDetails.info.rdns
    }

    public getWalletUUID(): string | null {
        return this.providerDetails.info.uuid
    }
}

const NATIVE_CURRENCY = {
    name: 'HBAR',
    decimals: 18,
    symbol: 'HBAR'
}

const CHAIN_PARAM_MAINNET: AddEthereumChainParameter = {
    chainId: "0x127",
    blockExplorerUrls: [
        "https://hashscan.io/mainnet/dashboard"
    ],
    chainName: "Hedera Mainnet",
    iconUrls: [
        HEDERA_LOGO
    ],
    nativeCurrency: NATIVE_CURRENCY,
    rpcUrls: [
        "https://mainnet.hashio.io/api"
    ]
}

const CHAIN_PARAM_TESTNET: AddEthereumChainParameter = {
    chainId: "0x128",
    blockExplorerUrls: [
        "https://hashscan.io/testnet/dashboard"
    ],
    chainName: "Hedera Testnet",
    iconUrls: [
        HEDERA_LOGO
    ],
    nativeCurrency: NATIVE_CURRENCY,
    rpcUrls: [
        "https://testnet.hashio.io/api"
    ]
}

const CHAIN_PARAM_PREVIEWNET: AddEthereumChainParameter = {
    chainId: "0x129",
    blockExplorerUrls: [
        "https://hashscan.io/previewnet/dashboard"
    ],
    chainName: "Hedera Previewnet",
    iconUrls: [
        HEDERA_LOGO
    ],
    nativeCurrency: NATIVE_CURRENCY,
    rpcUrls: [
        "https://previewnet.hashio.io/api"
    ]
}
