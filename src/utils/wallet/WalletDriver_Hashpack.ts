/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
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


import {HashConnect, HashConnectTypes, MessageTypes} from "hashconnect";
import {HederaLogo} from "@/utils/MetaMask";
import {WalletDriver} from "@/utils/wallet/WalletDriver";
import {HashConnectSigner} from "hashconnect/dist/provider/signer";
import {timeGuard, TimeGuardError} from "@/utils/TimerUtils";
import {Signer} from "@hashgraph/sdk/lib/Signer";
import {Signer} from "@hashgraph/sdk/lib/Signer";

export class WalletDriver_Hashpack extends WalletDriver {

    private signer: HashConnectSigner|null = null
    private lastHashConnectKey: string|null = null
    private lastHashConnectContext: HashConnectContext|null = null;

    //
    // Public
    //

    public constructor() {
        super("Hashpack", "https://uploads-ssl.webflow.com/61ce2e4bcaa2660da2bb419e/61cf5cc71c9324950d7e071d_logo-colour-white.svg")
    }


    //
    // WalletDriver
    //

    public async connect(network: string): Promise<void> {
        await this.performConnect(network)
    }

    public async disconnect(): Promise<void> {
        if (this.signer !== null) {
            this.signer = null
        }
        return Promise.resolve()
    }

    public getSigner(): Signer|null {
        return this.signer
    }

    public getSigner(): Signer|null {
        return this.signer
    }

    //
    // Private
    //

    private readonly appMetadata: HashConnectTypes.AppMetadata = {
        name: "Hedera Explorer",
        description: "A ledger explorer for the Hedera network",
        icon: HederaLogo
    }

    private async performConnect(network: string): Promise<void> {

        // connect / init
        const hashConnect = new HashConnect(false)
        const initData = await hashConnect.init(this.appMetadata, this.lastHashConnectKey ?? undefined)
        this.lastHashConnectKey = initData.privKey

        if (this.lastHashConnectContext === null || this.lastHashConnectContext.network != network) {

            // First connection
            const connectionState = await hashConnect.connect()
            const pairingString = hashConnect.generatePairingString(connectionState, network, true)

            // Find extension
            hashConnect.findLocalWallets()
            try {
                await timeGuard(hashConnect.foundExtensionEvent.once(), 200)
            } catch(error) {
                if (error instanceof TimeGuardError) {
                    throw this.extensionNotFound()
                } else {
                    throw error
                }
            }

            // Pairing
            hashConnect.connectToLocalWallet(pairingString)
            const pairingData = await hashConnect.pairingEvent.once()

            // Check pairing data
            if (pairingData.network != network) {
                throw this.connectFailure("Unexpected pairing data")
            } else {
                this.lastHashConnectContext = {
                    network: network,
                    topic: connectionState.topic,
                    pairingString: pairingString,
                    pairingData: pairingData
                }
            }

        } else {

            // Second connection
            try {
                await hashConnect.connect(
                    this.lastHashConnectContext.topic,
                    this.lastHashConnectContext.pairingData.metadata)
            } catch(error) {
                this.lastHashConnectContext = null
                throw error
            }

        }

        // Updates signer
        const accountIds = this.lastHashConnectContext.pairingData.accountIds ?? []
        const accountId = accountIds.length >= 1 ? accountIds[0] : null
        if (accountId !== null) {
            const provider = hashConnect.getProvider(network, this.lastHashConnectContext.topic, accountId)
            this.signer = hashConnect.getSigner(provider)
        } else {
            await this.disconnect()
        }
    }

}

export interface HashConnectContext {
    network: string
    topic: string
    pairingString: string
    pairingData: MessageTypes.ApprovePairing
}
