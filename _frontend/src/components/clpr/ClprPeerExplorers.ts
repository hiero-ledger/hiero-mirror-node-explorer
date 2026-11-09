// SPDX-License-Identifier: Apache-2.0

// Explorers of the peer chains, keyed by CAIP-2 chain id. A curated list maintained by the Explorer:
// convenience, not protocol data. Chains absent from the list simply have no link.
// Values are the ones of the HTML mockup.

const CLPR_PEER_EXPLORERS: Record<string, string> = {
    "eip155:1": "https://etherscan.io",
    "eip155:137": "https://polygonscan.com",
    "hedera:testnet": "https://hashscan.io/testnet",
}

export function getPeerExplorerURL(chainId: string | null): string | null {
    return chainId !== null ? CLPR_PEER_EXPLORERS[chainId] ?? null : null
}
