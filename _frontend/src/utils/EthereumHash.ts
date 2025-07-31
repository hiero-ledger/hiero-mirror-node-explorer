// SPDX-License-Identifier: Apache-2.0

import {byteToHex, hexToByte} from "@/utils/B64Utils";

export class EthereumHash {

    public readonly bytes: Uint8Array

    //
    // Public
    //

    public static parse(byteString: string): EthereumHash | null {
        const bytes = hexToByte(byteString)
        return bytes !== null && bytes.length == 32 ? new EthereumHash(bytes) : null
    }

    public toString(): string {
        return "0x" + byteToHex(this.bytes)
    }

    //
    // Private
    //

    private constructor(bytes: Uint8Array) {
        this.bytes = bytes
    }
}
