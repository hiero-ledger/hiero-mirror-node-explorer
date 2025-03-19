// SPDX-License-Identifier: Apache-2.0

import {byteToHex, hexToByte} from "@/utils/B64Utils";
import {EntityID} from "@/utils/EntityID";
import {ethers} from "ethers";

export class EthereumAddress {

    public readonly bytes: Uint8Array

    //
    // Public
    //

    public static parse(byteString: string): EthereumAddress | null {
        const bytes = hexToByte(byteString)
        return bytes !== null && bytes.length == 20 ? new EthereumAddress(bytes) : null
    }

    public static normalizeEIP55(byteString: string): string {
        // https://eips.ethereum.org/EIPS/eip-55
        // https://docs.ethers.org/v6/api/address/#getAddress
        return ethers.getAddress(byteString)
    }

    public toString(): string {
        return "0x" + byteToHex(this.bytes)
    }

    public toCompactString(digitKept = 6): string {
        return "0x"
            + byteToHex(this.bytes.slice(0, 1))
            + "…" + byteToHex(this.bytes.slice(-digitKept / 2))
    }

    public toEntityID(baseShard = 0, baseRealm = 0): EntityID | null {
        let result: EntityID | null
        if (this.isLongZeroForm()) {
            const view = new DataView(this.bytes.buffer)
            const bigNum = view.getBigInt64(12)
            const num = 0 <= bigNum && bigNum < EntityID.MAX_INT ? Number(bigNum) : null
            result = num != null ? new EntityID(baseShard, baseRealm, num, null) : null
        } else {
            result = null
        }
        return result
    }

    public isLongZeroForm(): boolean {
        return this.bytes.slice(0, 12).every((value) => value === 0)
    }

    //
    // Private
    //

    private constructor(bytes: Uint8Array) {
        this.bytes = bytes
    }
}
