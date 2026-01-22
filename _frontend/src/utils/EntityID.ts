// SPDX-License-Identifier: Apache-2.0

import {byteToHex, hexToByte} from "./B64Utils";

export class EntityID {

    public readonly shard: number
    public readonly realm: number
    public readonly num: number
    public readonly checksum: string | null


    //
    // Public
    //

    public constructor(shard: number, realm: number, num: number, checksum: string | null) {
        this.shard = shard
        this.realm = realm
        this.num = num
        this.checksum = checksum
    }

    public static parse(s: string): EntityID | null {
        let result: EntityID | null
        const parts = s.split(".")
        if (parts.length === 3) {
            const [shardString, realmString, numString] = parts
            const shard = EntityID.parsePositiveInt(shardString)
            const realm = EntityID.parsePositiveInt(realmString)
            const num = EntityID.parsePositiveInt(numString)
            if (shard === null || realm === null || num === null) {
                result = null
            } else {
                result = new EntityID(shard, realm, num, null)
            }
        } else {
            result = null
        }
        return result
    }

    public static parseWithChecksum(s: string): EntityID | null {
        let result: EntityID | null

        const i = s.indexOf("-")
        if (i != -1) {
            const id = s.substring(0, i)
            const checksum = s.substring(i + 1)
            const entityId = EntityID.parse(id)
            if (entityId !== null && hasChecksumSyntax(checksum)) {
                result = new EntityID(entityId.shard, entityId.realm, entityId.num, checksum)
            } else {
                result = null
            }
        } else {
            result = EntityID.parse(s)
        }

        return result
    }

    public static normalize(s: string): string | null {
        const id = EntityID.parse(s)
        return id !== null ? id.toString() : null
    }

    public toString(): string {
        return this.shard + "." + this.realm + "." + this.num
    }

    public toAddress(): string {
        const buffer = new Uint8Array(20);
        const view = new DataView(buffer.buffer, 0, 20);

        view.setBigInt64(12, BigInt(this.num));

        return byteToHex(buffer)
    }

    public static fromAddress(address: string | undefined, baseShard = 0, baseRealm = 0): EntityID | null {
        let result: EntityID | null

        if (address) {
            const buffer = hexToByte(address)
            if (buffer !== null && buffer.length === 20) {
                const view = new DataView(buffer.buffer)
                const bigNum = view.getBigInt64(12)

                if (0 <= bigNum && bigNum < EntityID.MAX_INT) {
                    result = new EntityID(baseShard, baseRealm, Number(bigNum), null)
                } else {
                    result = null
                }
            } else {
                result = null
            }
        } else {
            result = null
        }

        return result
    }

    /*
     * Compare two account ID.
     * Accounts are sorted in ascending but account ids < 100 are put at the end.
     */
    public compareAccountID(that: EntityID): number {
        let result = compareNumber(this.shard, that.shard)
        if (result == 0) {
            result = compareNumber(this.realm, that.realm)
        }
        if (result == 0) {
            if ((this.num < 100 || this.num === 800 || this.num === 801) && (that.num >= 100 && that.num !== 800 && that.num !== 801)) {
                // We put this.num at the end
                result = +1
            } else if ((that.num < 100 || that.num === 800 || that.num === 801) && (this.num >= 100 && this.num != 800 && this.num != 801)) {
                // We put that.num at the end
                result = -1
            } else {
                result = compareNumber(this.num, that.num)
            }
        }
        return result
    }

    public static compareAccountID(e1: string, e2: string): number {
        let result: number
        const o1 = EntityID.parse(e1)
        const o2 = EntityID.parse(e2)
        if (o1 !== null && o2 !== null) {
            result = o1.compareAccountID(o2)
        } else {
            result = e1.localeCompare(e2)
        }
        return result
    }


    // Utility

    public static readonly MAX_INT = Math.pow(2, 32) // Max supported by mirror node rest api on May 30, 2022

    public static parsePositiveInt(s: string): number | null {
        const n = s.match(/^[0-9]+$/) !== null ? parseInt(s) : EntityID.MAX_INT
        return (isNaN(n) || n >= EntityID.MAX_INT) ? null : n
    }

}


function compareNumber(n1: number, n2: number): number {
    let result: number
    if (n1 < n2) {
        result = -1
    } else if (n1 > n2) {
        result = +1
    } else {
        result = 0
    }
    return result
}

function hasChecksumSyntax(s: string): boolean {
    const re = /[a-z]+/
    return s.length == 5 && re.test(s)
}
