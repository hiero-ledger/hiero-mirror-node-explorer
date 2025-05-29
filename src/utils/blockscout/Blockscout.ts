// SPDX-License-Identifier: Apache-2.0

export namespace Blockscout {

    //
    // https://eth.blockscout.com/api-docs
    //

    export interface TokenInfo {
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

    export interface Response<T> {
        items: T[]
        next_page_params: NextPageParams|null
    }

    export type TokenInfoResponse = Response<TokenInfo>
    export type NextPageParams = Record<string, unknown>
}
