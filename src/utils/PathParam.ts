// SPDX-License-Identifier: Apache-2.0

import {aliasToBase32, base32ToAlias, byteToHex, hexToByte} from "@/utils/B64Utils";
import {EntityID} from "@/utils/EntityID";
import {TransactionID} from "@/utils/TransactionID";
import {TransactionHash} from "@/utils/TransactionHash";
import {EthereumHash} from "@/utils/EthereumHash";
import {Timestamp} from "@/utils/Timestamp";
import {EthereumAddress} from "@/utils/EthereumAddress";
import {AccountAlias} from "@/utils/AccountAlias";

export class PathParam { // Block Hash or Number

    public static parseBlockLoc(s: string): number | TransactionHash | EthereumHash | null {
        let result: number | TransactionHash | EthereumHash | null

        result = TransactionHash.parse(s)
        if (result === null) {
            result = EthereumHash.parse(s)
        }
        if (result === null) {
            const n = parseInt(s, 10)
            if (!isNaN(n) && n >= 0 && n.toString() == s) {
                result = n
            }
        }

        return result
    }

    public static parseAccountLoc(l: string): EntityID | EthereumAddress | AccountAlias | null {
        return EntityID.parse(l) ?? EthereumAddress.parse(l) ?? AccountAlias.parse(l)
    }

    public static parseAccountIdOrAliasOrEvmAddress(s: string | undefined): string | null {
        let result: string | null

        if (s) {
            const id = EntityID.parse(s)
            if (id !== null) {
                result = id.toString()
            } else {
                const alias = base32ToAlias(s)
                if (alias !== null) {
                    result = aliasToBase32(alias)
                } else {
                    const hex = hexToByte(s)
                    if (hex !== null) {
                        if (hex.length == 20) {
                            result = "0x" + byteToHex(hex) // EVM address
                        } else {
                            result = aliasToBase32(hex) // Account alias expressed in hex and reconverted in base32
                        }
                    } else {
                        result = null
                    }
                }
            }
        } else {
            result = null
        }

        return result
    }

    public static parseContractLoc(l: string): EntityID | EthereumAddress | null {
        return EntityID.parse(l) ?? EthereumAddress.parse(l)
    }

    public static parseNodeId(s: string | undefined): number | null {
        let result: number | null

        if (s) {
            const n = parseInt(s)
            result = isNaN(n) || n < 0 ? null : n
        } else {
            result = null
        }

        return result
    }

    public static parseTransactionLoc(s: string): Timestamp | TransactionHash | EthereumHash | null {
        return Timestamp.parse(s) ?? TransactionHash.parse(s) ?? EthereumHash.parse(s)
    }

    public static parseEvmAddress(s: string | undefined): string | null {
        let result: string | null
        if (s) {
            const hex = hexToByte(s)
            if (hex !== null && hex.length == 20) {
                result = "0x" + byteToHex(hex)
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    }
}
