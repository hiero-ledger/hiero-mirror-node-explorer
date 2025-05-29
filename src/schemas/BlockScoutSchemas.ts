// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Account
// ---------------------------------------------------------------------------------------------------------------------

//
// https://eth.blockscout.com/api-docs
//

export interface BlockscoutTokenInfo {
    circulating_market_cap: string|null
    icon_url: string|null
    name: string|null
    decimals: string|null
    symbol: string|null
    address: string
    type: string
    holders: string|null
    exchange_rate: string|null
    total_supply: string
}

export interface BlockscoutTokenResponse {
    items: BlockscoutTokenInfo[]
    next_page_params: object
}
