// SPDX-License-Identifier: Apache-2.0

//
// https://eips.ethereum.org/EIPS/eip-1193
//

export interface EIP1193Provider {
    isStatus?: boolean
    host?: string
    path?: string
    sendAsync?: (
        request: { method: string; params?: Array<unknown> | object },
        callback: (error: Error | null, response: unknown) => void
    ) => void
    send?: (
        request: { method: string; params?: Array<unknown> | object },
        callback: (error: Error | null, response: unknown) => void
    ) => void
    request: (request: {
        method: string
        params?: Array<unknown> | object
    }) => Promise<unknown>
}

declare global {
    export interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent
    }
}

//
// Tools
//

//
// https://eips.ethereum.org/EIPS/eip-1474
//


export async function eth_requestAccounts(p: EIP1193Provider): Promise<string[]> {
    return await p.request({
        "method": "eth_requestAccounts",
        "params": [],
    }) as string[]
}

export async function eth_accounts(p: EIP1193Provider): Promise<string[]> {
    return await p.request({
        "method": "eth_accounts",
        "params": [],
    }) as string[]
}

export async function eth_chainId(p: EIP1193Provider): Promise<string> {
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md
    return await p.request({
        "method": "eth_chainId",
        "params": [],
    }) as string
}

export async function wallet_switchEthereumChain(p: EIP1193Provider, newChainId: string): Promise<void> {
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3326.md
    await p.request({
        "method": "wallet_switchEthereumChain",
        "params": [{
            chainId: newChainId
        }],
    })
}

export async function wallet_revokePermissions(p: EIP1193Provider): Promise<void> {
    await p.request({
        "method": "wallet_revokePermissions",
        "params": [{
            eth_accounts: {}
        }],
    })
}

//
// Error tooling
//

export function eth_getErrorCode(reason: unknown): number | null {
    let result: number | null
    if (typeof reason == "object" && reason !== null && "code" in reason && typeof reason["code"] == "number") {
        result = reason["code"]
    } else {
        result = null
    }
    return result
}

export function eth_getMessage(reason: unknown): string | null {
    let result: string | null
    if (typeof reason == "object" && reason !== null && "message" in reason && typeof reason["message"] == "string") {
        result = reason["message"]
    } else {
        result = null
    }
    return result
}

export function eth_isUserReject(reason: unknown): boolean {
    // https://eips.ethereum.org/EIPS/eip-1193#provider-errors
    return eth_getErrorCode(reason) == 4001
}

export function eth_isUnsupportedMethod(reason: unknown): boolean {
    // https://eips.ethereum.org/EIPS/eip-1474
    const code = eth_getErrorCode(reason)
    return code == -32601 || code == -32004
}
//
// export function eth_isUnrecognizedChainId(reason: unknown): boolean {
//     // https://eips.ethereum.org/EIPS/eip-3326
//     return eth_getErrorCode(reason) == 4902
// }


export interface AddEthereumChainParameter {
    // https://eips.ethereum.org/EIPS/eip-3085
    chainId: string;
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls?: string[];
}

export async function wallet_addEthereumChain(p: EIP1193Provider, param: AddEthereumChainParameter): Promise<void> {
    await p.request({
        "method": "wallet_addEthereumChain",
        "params": [param],
    })
}
