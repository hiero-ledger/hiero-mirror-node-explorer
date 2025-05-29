// SPDX-License-Identifier: Apache-2.0

//
// https://eth.blockscout.com/api-docs
//

export interface BlockscoutTokenInfo {
    circulating_market_cap: string | null
    icon_url: string | null
    name: string | null
    decimals: string | null
    symbol: string | null
    address: string
    type: string
    holders: string | null
    exchange_rate: string | null
    total_supply: string
}

export interface BlockscoutTokenResponse {
    items: BlockscoutTokenInfo[]
    next_page_params: object
}

export interface BlockscoutTokenBalance {
    token_instance?: BlockScoutNFTInstance | null
    value: string
    token_id: string | null
    token: BlockscoutTokenInfo
}

export interface BlockScoutNFTInstance {
    is_unique: boolean | null
    id: string
    holder_address_hash: string
    image_url: string | null
    animation_url: string
    external_app_url: string | null
    media_type: string | null
    media_url: string | null
    metadata: any | null
    owner: any | null
    thumbnails: any | null
    token: BlockscoutTokenInfo
}
