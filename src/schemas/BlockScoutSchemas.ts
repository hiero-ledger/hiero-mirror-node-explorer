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
    metadata: object | null
    owner: object | null
    thumbnails: object | null
    token: BlockscoutTokenInfo
}

export interface BlockscoutHolder {
    address: BlockscoutAddressParam
    value: string
    token_id: string
}

export interface BlockscoutAddressParam {
    hash: string
    implementation_name: string
    name: string
    ens_domain_name: string | null
    metadata: object | null
    is_contract: boolean
    private_tags: BlockscoutAddressTag []
    watchlist_names: BlockscoutWatchlistName []
    public_tags: BlockscoutAddressTag []
    is_verified: boolean
}

export interface BlockscoutAddressTag {
    address_hash: string
    display_name: string
    label: string
}

export interface BlockscoutWatchlistName {
    display_name: string
    label: string
}

export interface BlockscoutHolderResponse {
    items: BlockscoutHolder[]
    next_page_params: object
}
