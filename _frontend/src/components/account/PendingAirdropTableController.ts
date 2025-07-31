// SPDX-License-Identifier: Apache-2.0

import {TokenAirdrop, TokenAirdropsResponse, TokenType,} from "@/schemas/MirrorNodeSchemas";
import {Ref} from "vue";
import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Router} from "vue-router";
import axios, {AxiosResponse} from "axios";
import {AppStorage} from "@/AppStorage.ts";

export class PendingAirdropTableController extends TableController<TokenAirdrop, AirdropKey> {

    //
    // Public
    //

    public readonly accountId: Ref<string | null>
    public readonly tokenType: TokenType

    public constructor(
        router: Router,
        accountId: Ref<string | null>,
        tokenType: TokenType,
        defaultPageSize: number,
        pageParamName = "p",
        keyParamName = "k"
    ) {
        super(
            router,
            defaultPageSize,
            TableController.SLOW_REFRESH_PERIOD,
            0,
            100,
            AppStorage.ACCOUNT_TOKENS_TABLE_PAGE_SIZE_KEY,
            pageParamName,
            keyParamName
        )
        this.accountId = accountId
        this.tokenType = tokenType
        this.watchAndReload([this.accountId, this.pageSize])
    }

    public async loadAllAirdrops(limit = 100): Promise<TokenAirdrop[] | null> {
        return this.load(null, KeyOperator.lt, SortOrder.DESC, limit)
    }

    //
    // TableController
    //

    public async load(key: AirdropKey | null, operator: KeyOperator, order: SortOrder, limit: number): Promise<TokenAirdrop[] | null> {
        let result: TokenAirdrop[] | null

        if (this.accountId.value === null) {
            result = null
        } else {
            let params = PendingAirdropTableController.makeQueryParams(key, operator, order, limit)
            let url: string | null = "api/v1/accounts/" + this.accountId.value + "/airdrops/pending"
            result = []

            while (url && result.length < limit) {
                const response: AxiosResponse<TokenAirdropsResponse> =
                    await axios.get<TokenAirdropsResponse>(url, {params: params})
                const airdrop = response.data.airdrops ?? []
                result = result.concat(airdrop.filter(
                        this.tokenType === TokenType.FUNGIBLE_COMMON
                            ? PendingAirdropTableController.filterFungible
                            : PendingAirdropTableController.filterNft
                    )
                )
                url = response.data.links?.next ?? null
                params = {} as QueryParams
            }
        }
        return Promise.resolve(result)
    }

    public keyFor(row: TokenAirdrop): AirdropKey {
        return {
            sender_id: row.sender_id,
            token_id: row.token_id,
            serial_number: row.serial_number
        }
    }

    public stringFromKey(k: AirdropKey): string {
        return k.sender_id + "-" + k.token_id + "-" + k.serial_number
    }

    public keyFromString(s: string): AirdropKey | null {
        let result: AirdropKey | null
        const items = s.split("-")
        if (items.length == 3) {
            const serial_number = Number(items[3])
            if (isNaN(serial_number)) {
                result = null
            } else {
                result = {
                    sender_id: items[0],
                    token_id: items[2],
                    serial_number
                }
            }
        } else {
            result = null
        }
        return result
    }

    //
    // Private
    //

    private static filterFungible = (airdrop: TokenAirdrop) => !airdrop.serial_number || airdrop.serial_number === 0

    private static filterNft = (airdrop: TokenAirdrop) => airdrop.serial_number && airdrop.serial_number >= 1

    private static makeQueryParams(key: AirdropKey | null, operator: KeyOperator, order: SortOrder, limit: number): QueryParams {
        const result: QueryParams = {
            limit: limit,
            order: order
        }

        if (key !== null) {
            if (key.serial_number !== null) {
                switch (operator) {
                    case KeyOperator.lt:
                        result["sender.id"] = KeyOperator.lte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.lte + ":" + key.token_id
                        result["serialnumber"] = KeyOperator.lt + ":" + key.serial_number
                        break
                    case KeyOperator.lte:
                        result["sender.id"] = KeyOperator.lte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.lte + ":" + key.token_id
                        result["serialnumber"] = KeyOperator.lte + ":" + key.serial_number
                        break
                    case KeyOperator.gt:
                        result["sender.id"] = KeyOperator.gte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.gte + ":" + key.token_id
                        result["serialnumber"] = KeyOperator.gt + ":" + key.serial_number
                        break
                    case KeyOperator.gte:
                        result["sender.id"] = KeyOperator.gte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.gte + ":" + key.token_id
                        result["serialnumber"] = KeyOperator.gte + ":" + key.serial_number
                        break
                }
            } else {
                switch (operator) {
                    case KeyOperator.lt:
                        result["sender.id"] = KeyOperator.lte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.lt + ":" + key.token_id
                        break
                    case KeyOperator.lte:
                        result["sender.id"] = KeyOperator.lte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.lte + ":" + key.token_id
                        break
                    case KeyOperator.gt:
                        result["sender.id"] = KeyOperator.gte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.gt + ":" + key.token_id
                        break
                    case KeyOperator.gte:
                        result["sender.id"] = KeyOperator.gte + ":" + key.sender_id
                        result["token.id"] = KeyOperator.gte + ":" + key.token_id
                        break
                }
                // result["serialnumber"]  is left undefined
            }
        }

        return result
    }

}

export interface AirdropKey {
    sender_id: string | null,
    token_id: string | null,
    serial_number: number | null | undefined
}

interface QueryParams {
    limit: number
    order: string
    "sender.id"?: string
    "token.id"?: string
    "serialnumber"?: string
}

// create unique index if not exists token_airdrop__sender_id on token_airdrop (
//      sender_account_id,
//      receiver_account_id,
//      token_id,
//      serial_number
// )
