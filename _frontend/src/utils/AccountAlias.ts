// SPDX-License-Identifier: Apache-2.0

import {aliasToBase32, base32ToAlias, byteToHex, hexToByte} from "@/utils/B64Utils";

export class AccountAlias {

    public readonly bytes: Uint8Array

    //
    // Public
    //

    public static parse(a: string): AccountAlias | null {
        let bytes = base32ToAlias(a)
        if (bytes === null) {
            bytes = hexToByte(a)
        }
        return bytes !== null && bytes.length >= 32 ? new AccountAlias(bytes) : null
    }

    public toString(): string {
        return aliasToBase32(this.bytes)
    }

    public toHexString(): string {
        return byteToHex(this.bytes)
    }

    //
    // Private
    //

    private constructor(bytes: Uint8Array) {
        this.bytes = bytes
    }

}
