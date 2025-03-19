// SPDX-License-Identifier: Apache-2.0

import {EntityID} from "@/utils/EntityID";
import {routeManager} from "@/router.ts";

export class SystemContractRegistry {

    private readonly entries = new Map<string, SystemContractEntry>()

    constructor() {
        this.addEntry("0.0.359", "Hedera Token Service System Contract", "IHederaTokenService.json")
        this.addEntry("0.0.360", "Hedera Exchange Rate System Contract", "IExchangeRate.json")
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
    public readonly abiURL: string

    constructor(contractId: string, description: string, abiFileName: string) {
        this.contractId = contractId
        this.description = description
        this.abiFileName = abiFileName
        this.abiURL = window.location.origin + "/abi/" + abiFileName
    }
}

export const systemContractRegistry = new SystemContractRegistry()

