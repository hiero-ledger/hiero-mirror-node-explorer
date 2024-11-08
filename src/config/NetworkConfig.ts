/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import axios from "axios";
import {fetchBoolean, fetchNumber, fetchObject, fetchString, fetchURL} from "@/config/ConfigUtils";
import {inject} from "vue";
import {networkConfigKey} from "@/AppKeys";
import {hip15checksum} from "@/schemas/HederaUtils";

export class SourcifySetup {

    //
    // Public
    //

    static parse(obj: object): SourcifySetup {

        const activate = fetchBoolean(obj, "activate")
        const repoURL = fetchURL(obj, "repoURL")
        const serverURL = fetchURL(obj, "serverURL")
        const verifierURL = fetchURL(obj, "verifierURL")
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
        if (verifierURL === null) {
            throw this.missingPropertyError("verifierURL")
        }
        if (chainID === null) {
            throw this.missingPropertyError("chainID")
        }

        return new SourcifySetup(
            activate,
            repoURL,
            serverURL,
            verifierURL,
            chainID
        )
    }

    //
    // Private
    //

    private constructor(
        public readonly activate: boolean,
        public readonly repoURL: string,
        public readonly serverURL: string,
        public readonly verifierURL: string,
        public readonly chainID: number,
    ) {}

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
        const enableWallet = fetchBoolean(obj, "enableWallet")
        const enableStaking = fetchBoolean(obj, "enableStaking")
        const enableExpiry = fetchBoolean(obj, "enableExpiry")
        const enableMarket = fetchBoolean(obj, "enableMarket")
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
        if (enableWallet === null) {
            throw this.missingPropertyError("enableWallet")
        }
        if (enableStaking === null) {
            throw this.missingPropertyError("enableStaking")
        }
        if (enableExpiry === null) {
            throw this.missingPropertyError("enableExpiry")
        }
        if (enableMarket === null) {
            throw this.missingPropertyError("enableMarket")
        }
        if (sourcifySetupObj === null) {
            throw this.missingPropertyError("sourcifySetupObj")
        }

        let tidyDisplayName = (displayName ?? name).toUpperCase()
        if (tidyDisplayName.length > this.NETWORK_NAME_MAX_LENGTH) {
            tidyDisplayName = tidyDisplayName.slice(0, this.NETWORK_NAME_MAX_LENGTH) + '…'
        }

        const sourcifySetup = SourcifySetup.parse(sourcifySetupObj)

        return new NetworkEntry(
            name,
            tidyDisplayName,
            url,
            ledgerID,
            enableWallet,
            enableStaking,
            enableExpiry,
            enableMarket,
            sourcifySetup
        )
    }

    //
    // Private
    //

    private constructor(
        public readonly name: string,
        public readonly displayName: string,
        public readonly url: string,
        public readonly ledgerID: string,

        // When set to 'true', this variable will enable connecting a wallet
        public readonly enableWallet: boolean,
        // When set to 'true', this variable will enable staking feature
        public readonly enableStaking: boolean,
        // When set to 'true', this variable will enable properties related to account/contract expiry
        public readonly enableExpiry: boolean,

        // When set to 'true', this variable will enable the market dashboard
        public readonly enableMarket: boolean,

        public readonly sourcifySetup: SourcifySetup | null
    ) {}

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
            enableWallet: true,
            enableStaking: true,
            enableExpiry: false,
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
        return NetworkConfig.parse({ })
    }

    public lookup(name: string): NetworkEntry | null {
        return this.entries.find(element => element.name === name) ?? null
    }

    public isValidChecksum(id: string, checksum: string, network: string): boolean {
        return this.computeChecksum(id, network) == checksum
    }

    public computeChecksum(id: string, network: string): string {
        const ledgerID = this.lookup(network)?.ledgerID
        return hip15checksum(ledgerID ?? 'FF', id)
    }

    //
    // Private
    //

    private constructor(public readonly entries: NetworkEntry[]) {}


    private static parse(obj: object): NetworkConfig {
        let entries: NetworkEntry[] = []
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

