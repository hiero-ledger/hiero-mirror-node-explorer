// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {fetchBoolean, fetchNumber, fetchObject, fetchString, fetchURL} from "@/config/ConfigUtils";
import {inject} from "vue";
import {networkConfigKey} from "@/AppKeys";
import {hip15checksum} from "@/schemas/MirrorNodeUtils.ts";
import {EntityID} from "@/utils/EntityID";
import {EthereumAddress} from "@/utils/EthereumAddress";
import {ColorMap, NetworkColorMaps} from "@/config/NetworkColorMaps.ts";

export class SourcifySetup {

    //
    // Public
    //

    static parse(obj: object): SourcifySetup {

        const activate = fetchBoolean(obj, "activate") ?? true
        const repoURL = fetchURL(obj, "repoURL")
        const serverURL = fetchURL(obj, "serverURL")
        const chainID = fetchNumber(obj, "chainID")

        if (activate === null) {
            throw this.missingPropertyError("activate")
        }
        if (repoURL === null) {
            throw this.missingPropertyError("repoURL")
        }
        if (serverURL === null) {
            throw this.missingPropertyError("serverURL")
        }
        if (chainID === null) {
            throw this.missingPropertyError("chainID")
        }

        return new SourcifySetup(
            activate,
            repoURL,
            serverURL,
            chainID
        )
    }

    // https://docs.sourcify.dev/docs/api/repository/get-file-static/

    makeRequestURL(contractAddress: string): string {
        const normalizedAddress = EthereumAddress.normalizeEIP55(contractAddress)
        return this.serverURL + "files/any/" + this.chainID + "/" + normalizedAddress
    }

    makeContractSourceURL(contractAddress: string, full: boolean): string {
        const normalizedAddress = EthereumAddress.normalizeEIP55(contractAddress)
        const matchPrefix = full ? "full_match/" : "partial_match/"
        return this.repoURL + matchPrefix + this.chainID + "/" + normalizedAddress
    }

    makeCheckAllByAddressURL(): string {
        return this.serverURL + "check-all-by-addresses"
    }

    //
    // Private
    //

    private constructor(
        public readonly activate: boolean,
        public readonly repoURL: string,
        public readonly serverURL: string,
        public readonly chainID: number,
    ) {
    }

    private static missingPropertyError(key: string): Error {
        throw new Error("Property " + key + " is missing")
    }
}

export class NetworkEntry {

    public static readonly NETWORK_NAME_MAX_LENGTH = 15

    static parse(obj: object): NetworkEntry {

        const name = fetchString(obj, "name")
        const displayName = fetchString(obj, "displayName")
        const url = fetchURL(obj, "url")
        const ledgerID = fetchString(obj, "ledgerID")
        const baseRealm = fetchNumber(obj, "baseRealm") ?? 0
        const baseShard = fetchNumber(obj, "baseShard") ?? 0
        const enableWallet = fetchBoolean(obj, "enableWallet") ?? false
        const enableStaking = fetchBoolean(obj, "enableStaking") ?? false
        const enableExpiry = fetchBoolean(obj, "enableExpiry") ?? false
        const enableMarket = fetchBoolean(obj, "enableMarket") ?? false
        const popularTokenIndexURL = fetchURL(obj, "popularTokenIndexURL")
        const erc20IndexURL = fetchURL(obj, "erc20IndexURL")
        const erc721IndexURL = fetchURL(obj, "erc721IndexURL")

        const sourcifySetupObj = fetchObject(obj, "sourcifySetup")

        if (name === null) {
            throw this.missingPropertyError("name")
        }
        if (url === null) {
            throw this.missingPropertyError("url")
        }
        if (ledgerID === null) {
            throw this.missingPropertyError("ledgerID")
        }

        let tidyDisplayName = (displayName ?? name).toUpperCase()
        if (tidyDisplayName.length > this.NETWORK_NAME_MAX_LENGTH) {
            tidyDisplayName = tidyDisplayName.slice(0, this.NETWORK_NAME_MAX_LENGTH) + '…'
        }

        const sourcifySetup = sourcifySetupObj !== null ? SourcifySetup.parse(sourcifySetupObj) : null

        return new NetworkEntry(
            name,
            tidyDisplayName,
            url,
            ledgerID,
            baseRealm,
            baseShard,
            enableWallet,
            enableStaking,
            enableExpiry,
            enableMarket,
            popularTokenIndexURL,
            erc20IndexURL,
            erc721IndexURL,
            sourcifySetup
        )
    }

    //
    // Private
    //

    private constructor(
        public readonly name: string,
        public readonly displayName: string,
        public readonly mirrorNodeURL: string,
        public readonly ledgerID: string,
        public readonly baseRealm: number,
        public readonly baseShard: number,
        // When set to 'true', this variable will enable connecting a wallet
        public readonly enableWallet: boolean,
        // When set to 'true', this variable will enable staking feature
        public readonly enableStaking: boolean,
        // When set to 'true', this variable will enable properties related to account/contract expiry
        public readonly enableExpiry: boolean,
        // When set to 'true', this variable will enable the market dashboard
        public readonly enableMarket: boolean,
        // The URL of the popular token index
        public readonly popularTokenIndexURL: string | null,
        // The URL of the ERC20 contract index
        public readonly erc20IndexURL: string | null,
        // The URL of the ERC721 contract index
        public readonly erc721IndexURL: string | null,
        public readonly sourcifySetup: SourcifySetup | null
    ) {
    }

    private static missingPropertyError(key: string): Error {
        throw new Error("Property " + key + " is missing")
    }
}

export class NetworkConfig {

    public static FALLBACK = NetworkConfig.parse([
        {
            activate: true,
            name: 'mainnet',
            displayName: 'MAINNET',
            url: "https://mainnet-public.mirrornode.hedera.com/",
            ledgerID: '00',
            baseRealm: 0,
            baseShard: 0,
            enableWallet: true,
            enableStaking: true,
            enableExpiry: true,
            enableMarket: true,
            sourcifySetup: SourcifySetup.parse({
                activate: true,
                repoURL: "",
                serverURL: "",
                verifierURL: "",
                chainID: 0x127
            })
        },
        {
            activate: true,
            name: 'testnet',
            displayName: 'TESTNET',
            url: "https://testnet.mirrornode.hedera.com/",
            ledgerID: '01',
            baseRealm: 0,
            baseShard: 0,
            enableWallet: true,
            enableStaking: true,
            enableExpiry: true,
            enableMarket: false,
            sourcifySetup: SourcifySetup.parse({
                activate: true,
                repoURL: "",
                serverURL: "",
                verifierURL: "",
                chainID: 0x128
            })
        },
        {
            activate: true,
            name: 'previewnet',
            displayName: 'PREVIEWNET',
            url: "https://previewnet.mirrornode.hedera.com/",
            ledgerID: '02',
            baseRealm: 0,
            baseShard: 0,
            enableWallet: false,
            enableStaking: true,
            enableExpiry: true,
            enableMarket: false,
            sourcifySetup: SourcifySetup.parse({
                activate: true,
                repoURL: "",
                serverURL: "",
                verifierURL: "",
                chainID: 0x129
            })
        }
    ])

    //
    // Public
    //

    public static async load(url: string): Promise<NetworkConfig> {
        let result: NetworkConfig
        const response = await axios.get<unknown>(url)
        if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
            result = this.parse(response.data)
        } else {
            throw new Error("networks-config.json is missing or cannot be decoded")
        }
        return result
    }

    public static inject(): NetworkConfig {
        return inject<NetworkConfig>(networkConfigKey, this.FALLBACK)
    }

    public static make(): NetworkConfig { // For unit testing
        return NetworkConfig.parse({})
    }

    public lookup(name: string): NetworkEntry | null {
        return this.entries.find(element => element.name === name) ?? null
    }

    public indexOf(name: string): number {
        return this.entries.findIndex(element => element.name === name)
    }

    public isValidChecksum(id: string, checksum: string, network: string): boolean {
        return this.computeChecksum(id, network) == checksum
    }

    public computeChecksum(id: string, network: string): string {
        const ledgerID = this.lookup(network)?.ledgerID
        return hip15checksum(ledgerID ?? 'FF', id)
    }

    public getColorMap(name: string): ColorMap | null {
        return this.networkColorMaps.getColorMap(this.indexOf(name))
    }

    //
    // Private
    //

    private networkColorMaps: NetworkColorMaps

    private constructor(public readonly entries: NetworkEntry[]) {
        this.networkColorMaps = new NetworkColorMaps()
    }

    public static parse(obj: object): NetworkConfig {
        const entries: NetworkEntry[] = []
        if (Array.isArray(obj)) {
            if (obj.length > 0) {
                for (const item of obj) {
                    entries.push(NetworkEntry.parse(item))
                }
            } else {
                throw Error("Expected at least one entry in array, got zero")
            }
        } else {
            throw Error("Expected array, got object")
        }

        return new NetworkConfig(entries)
    }
}

