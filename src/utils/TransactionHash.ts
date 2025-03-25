// SPDX-License-Identifier: Apache-2.0

import {base64DecToArr, base64EncArr, byteToHex, hexToByte} from "@/utils/B64Utils";

export class TransactionHash {

    public readonly bytes: Uint8Array

    //
    // Public
    //

    public static parse(byteString: string): TransactionHash | null {
        const bytes = hexToByte(byteString)
        return bytes !== null && bytes.length == 48 ? new TransactionHash(bytes) : null
    }

    public static parseBase64(base64: string): TransactionHash | null {
        const bytes = base64DecToArr(base64)
        return bytes !== null && bytes.length == 48 ? new TransactionHash(bytes) : null
    }

    public toString(): string {
        return byteToHex(this.bytes)
    }

    //
    // Private
    //

    private constructor(bytes: Uint8Array) {
        this.bytes = bytes
    }
}
