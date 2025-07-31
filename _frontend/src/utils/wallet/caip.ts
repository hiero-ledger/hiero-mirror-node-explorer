// SPDX-License-Identifier: Apache-2.0

//
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
// https://hips.hedera.com/hip/hip-30
//


// export function makeCaChainForEIP155(network: string): string {
//     const r = networkRegistry.lookup(network) ?? networkRegistry.getDefaultEntry()
//     return "eip155:" + r.sourcifySetup?.chainID
// }
//
// export function makeCaChainForHedera(network: string): string {
//     return "hedera:" + network
// }
//
// export function makeCaAccountIdForHedera(accountId: string, network: string): string {
//     return makeCaChainForHedera(network) + ":" + accountId
// }
//
// export function makeCaAccountIdForEIP155(accountAddress: string, network: string): string {
//     return makeCaChainForEIP155(network) + ":" + accountAddress
// }
//
// export function isEIP155CaChainId(caChainId: string): boolean {
//     return caChainId.startsWith("elp155:")
// }
//
// export function isHederaCaChainId(caChainId: string): boolean {
//     return caChainId.startsWith("hedera:")
// }
//
//

export class CAChainId {

    //
    // https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md
    //

    public constructor(
        public readonly namespace: string,
        public readonly reference: string) {
    }

    public toString(): string {
        return this.namespace + ":" + this.reference
    }

    public isHedera(): boolean {
        return this.namespace === CAChainId.NAMESPACE_HEDERA
    }

    public isEIP155(): boolean {
        return this.namespace === CAChainId.NAMESPACE_EIP155
    }

    public static parse(text: string): CAChainId | null {
        let result: CAChainId | null
        const components = text.split(":")
        if (components.length == 2) {
            result = new CAChainId(components[0], components[1])
        } else {
            result = null
        }
        return result
    }

    public static readonly NAMESPACE_HEDERA = "hedera"
    public static readonly NAMESPACE_EIP155 = "eip155"
}

export class CAAccountId {

    //
    // https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-10.md
    //

    public constructor(
        public readonly chainId: CAChainId,
        public readonly accountAddress: string) {
    }

    public toString(): string {
        return this.chainId.toString() + ":" + this.accountAddress
    }

    public static parse(text: string): CAAccountId | null {
        let result: CAAccountId | null
        const components = text.split(":")
        if (components.length == 3) {
            result = new CAAccountId(new CAChainId(components[0], components[1]), components[2])
        } else {
            result = null
        }
        return result
    }
}
