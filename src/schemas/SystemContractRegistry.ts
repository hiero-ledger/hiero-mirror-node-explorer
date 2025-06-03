// SPDX-License-Identifier: Apache-2.0

import {EntityID} from "@/utils/EntityID";
import {ethers} from "ethers";
import {routeManager} from "@/utils/RouteManager.ts";

export class SystemContractRegistry {

    private readonly entries = new Map<string, SystemContractEntry>()

    constructor() {
        this.addEntry("0.0.359", "Hedera Token Service System Contract", "IHederaTokenService")
        this.addEntry("0.0.360", "Hedera Exchange Rate System Contract", "IExchangeRate")
    }

    public lookup(contractId: string): SystemContractEntry | null {
        return this.entries.get(contractId) ?? null
    }

    public lookupByAddress(contractAddress: string): SystemContractEntry | null {
        const network = routeManager.currentNetworkEntry.value
        const entityID = EntityID.fromAddress(contractAddress, network.baseShard, network.baseRealm)
        return entityID != null ? this.lookup(entityID.toString()) : null
    }

    private addEntry(contractId: string, description: string, abiFileName: string) {
        if (!this.entries.get(contractId)) {
            this.entries.set(contractId, new SystemContractEntry(contractId, description, abiFileName))
        }
    }
}

export class SystemContractEntry {

    public readonly contractId: string
    public readonly description: string
    public readonly abiFileName: string

    constructor(contractId: string, description: string, abiFileName: string) {
        this.contractId = contractId
        this.description = description
        this.abiFileName = abiFileName
    }

    async loadABI(): Promise<ethers.Fragment[] | null> {
        const m = await import(`@/assets/abi/${this.abiFileName}.json`)
        return m.default.abi
    }
}

export const systemContractRegistry = new SystemContractRegistry()

