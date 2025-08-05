// SPDX-License-Identifier: Apache-2.0

import hashgraph from "@hashgraph/proto";
import {byteToHex} from "@/utils/B64Utils";
import {EntityID} from "@/utils/EntityID";

export class ComplexKeyLine {

    public readonly key: hashgraph.proto.Key
    public readonly level: number
    public readonly seqNb: number

    private static nextSeqNb = 0

    //
    // Public
    //

    public constructor(key: hashgraph.proto.Key, level: number) {
        this.key = key
        this.level = level
        this.seqNb = ComplexKeyLine.nextSeqNb
        ComplexKeyLine.nextSeqNb += 1
    }

    public static flattenComplexKey(key: hashgraph.proto.Key): ComplexKeyLine[] {
        const result: ComplexKeyLine[] = []
        this.flattenComplexKeyRec(key, 0, result)
        return result
    }

    public innerKeyBytes(): string | null {
        const bytes = this.key.ed25519 ?? this.key.ECDSASecp256k1 ?? this.key.ECDSA_384 ?? this.key.RSA_3072 ?? null
        return bytes !== null ? byteToHex(bytes) : null
    }

    public innerKeyType(): string | null {
        let result: string | null
        if (this.key.ed25519) {
            result = "ED25519"
        } else if (this.key.ECDSASecp256k1) {
            result = "ECDSA"
        } else if (this.key.RSA_3072) {
            result = "RSA_3072"
        } else if (this.key.ECDSA_384) {
            result = "ECDSA_384"
        } else {
            result = null
        }
        return result
    }

    public contractId(): string | null {
        return this.key.contractID ? ComplexKeyLine.makeContractId(this.key.contractID) : null
    }

    public delegatableContractId(): string | null {
        return this.key.delegatableContractId ? ComplexKeyLine.makeContractId(this.key.delegatableContractId) : null
    }

    public toString(): string {
        return "" + this.level + " " + this.key.key
    }

    //
    // Private
    //

    private static flattenComplexKeyRec(key: hashgraph.proto.Key, level: number, result: ComplexKeyLine[]): void {

        let newLine: ComplexKeyLine | null
        let childKeys: hashgraph.proto.Key[]
        if (key.keyList) {
            if (key.keyList.keys && key.keyList.keys.length == 1) {
                // Collapses singleton KeyList
                newLine = null
                childKeys = [key.keyList.keys[0]]
            } else {
                newLine = new ComplexKeyLine(key, level)
                childKeys = key.keyList?.keys ?? []
            }
            // newLine = new ComplexKeyLine(key, level)
            // childKeys = key.keyList?.keys ?? []
        } else if (key.thresholdKey) {
            if (key.thresholdKey.keys?.keys && key.thresholdKey.keys?.keys.length == 1) {
                // Collapses singleton ThresholdKey
                newLine = null
                childKeys = [key.thresholdKey.keys?.keys[0]]
            } else {
                newLine = new ComplexKeyLine(key, level)
                childKeys = key.thresholdKey?.keys?.keys ?? []
            }
            // newLine = new ComplexKeyLine(key, level)
            // childKeys = key.thresholdKey?.keys?.keys ?? []
        } else {
            newLine = new ComplexKeyLine(key, level)
            childKeys = []
        }
        if (newLine !== null) {
            result.push(newLine)
        }

        const nextLevel = newLine !== null ? level + 1 : level
        for (const childKey of childKeys) {
            this.flattenComplexKeyRec(childKey, nextLevel, result)
        }
    }

    private static makeContractId(iContractID: hashgraph.proto.IContractID): string {
        const shard = Number(iContractID.shardNum ?? 0)
        const realm = Number(iContractID.realmNum ?? 0)
        const num = Number(iContractID.contractNum ?? 0)
        const entityId = new EntityID(shard, realm, num, null)
        return entityId.toString()
    }
}
