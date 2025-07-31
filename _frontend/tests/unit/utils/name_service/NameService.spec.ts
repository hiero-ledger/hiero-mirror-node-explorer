// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {NameService} from "@/utils/name_service/NameService";
import {NameServiceProvider} from "@/utils/name_service/provider/NameServiceProvider";
import {nameServiceProviders} from "@/utils/name_service/provider/AllProviders";

describe("NameService", () => {

    test("resolve()", async () => {

        installTestProviders()

        const r1 = await NameService.instance.resolve("castor1", TEST_NETWORK)
        expect(r1.length).toBe(1)
        expect(r1[0].entityId).toBe("0.0.100")
        expect(r1[0].name).toBe("castor1")
        expect(castor.requestCount).toBe(1)
        expect(castor.resolutionCount).toBe(1)
        expect(pollux.requestCount).toBe(1)
        expect(pollux.resolutionCount).toBe(0)

        const r2 = await NameService.instance.resolve("castor2", TEST_NETWORK)
        expect(r2.length).toBe(1)
        expect(r2[0].entityId).toBe("0.0.101")
        expect(r2[0].name).toBe("castor2")
        expect(castor.requestCount).toBe(2)
        expect(castor.resolutionCount).toBe(2)
        expect(pollux.requestCount).toBe(2)
        expect(pollux.resolutionCount).toBe(0)

        const r3 = await NameService.instance.resolve("ambiguous", TEST_NETWORK)
        expect(r3.length).toBe(2)
        expect(r3[0].entityId).toBe("0.0.102")
        expect(r3[0].name).toBe("ambiguous")
        expect(castor.requestCount).toBe(3)
        expect(castor.resolutionCount).toBe(3)
        expect(pollux.requestCount).toBe(3)
        expect(pollux.resolutionCount).toBe(1)

        const r4 = await NameService.instance.resolve("unknown", TEST_NETWORK)
        expect(r4.length).toBe(0)
        expect(castor.requestCount).toBe(4)
        expect(castor.resolutionCount).toBe(3)
        expect(pollux.requestCount).toBe(4)
        expect(pollux.resolutionCount).toBe(1)

    })

    test("singleResolve()", async () => {

        installTestProviders()

        const r1 = await NameService.instance.singleResolve("castor1", TEST_NETWORK, "P1")
        expect(r1).not.toBeNull()
        expect(r1!.entityId).toBe("0.0.100")
        expect(r1!.name).toBe("castor1")
        expect(r1!.providerAlias).toBe("P1")
        expect(castor.requestCount).toBe(1)
        expect(castor.resolutionCount).toBe(1)
        expect(pollux.requestCount).toBe(0)
        expect(pollux.resolutionCount).toBe(0)

        const r2 = await NameService.instance.singleResolve("castor1", TEST_NETWORK, "P2")
        expect(r2).toBeNull()
        expect(castor.requestCount).toBe(1)
        expect(castor.resolutionCount).toBe(1)
        expect(pollux.requestCount).toBe(1)
        expect(pollux.resolutionCount).toBe(0)

        const r3 = await NameService.instance.singleResolve("ambiguous", TEST_NETWORK, "P1")
        expect(r3).not.toBeNull()
        expect(r3!.entityId).toBe("0.0.102")
        expect(r3!.name).toBe("ambiguous")
        expect(r3!.providerAlias).toBe("P1")
        expect(castor.requestCount).toBe(2)
        expect(castor.resolutionCount).toBe(2)
        expect(pollux.requestCount).toBe(1)
        expect(pollux.resolutionCount).toBe(0)

    })

})

const TEST_NETWORK = "testnet"

class TestProvider extends NameServiceProvider {

    public requestCount = 0
    public resolutionCount = 0
    private readonly resolutions: Map<string, string>

    constructor(private readonly alias: string, resolutions: [string, string][]) {
        super(alias, "Test Provider 1", null)
        this.resolutions = new Map<string, string>(resolutions)
    }

    public async resolve(name: string, network: string): Promise<string | null> {
        let result: string | null
        if (network == TEST_NETWORK) {
            result = this.resolutions.get(name) ?? null
        } else {
            result = null
        }
        this.requestCount += 1
        this.resolutionCount += result !== null ? 1 : 0
        return Promise.resolve(result)
    }

    public reset(): void {
        this.requestCount = 0
        this.resolutionCount = 0
    }
}

const castor = new TestProvider("P1", [
    ["castor1", "0.0.100"],
    ["castor2", "0.0.101"],
    ["ambiguous", "0.0.102"],
])
const pollux = new TestProvider("P2", [
    ["pollux1", "0.0.200"],
    ["pollux2", "0.0.201"],
    ["ambiguous", "0.0.202"],
])

function installTestProviders() {
    nameServiceProviders.splice(0)
    nameServiceProviders.push(castor)
    nameServiceProviders.push(pollux)
    castor.reset()
    pollux.reset()
}
