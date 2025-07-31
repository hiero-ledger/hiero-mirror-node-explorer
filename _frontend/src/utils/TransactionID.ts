// SPDX-License-Identifier: Apache-2.0

import {EntityID} from "./EntityID";
import {AppStorage} from "@/AppStorage";
import {computed, ref} from "vue";

export class TransactionID {

    public readonly entityID: EntityID
    public readonly seconds: number
    public readonly nanoSeconds: number
    public readonly queryParam: string|null


    //
    // Public
    //

    public static parse(value: string, autoComplete = false): TransactionID | null {
        // 0.0.88-1640084590-665216882                      useArobas == false
        // 0.0.88@1640084590.665216882                      useArobas == true
        // 0.0.88@1640084590                                useArobas == true
        // 00881640084590665216882

        let result: TransactionID | null

        const useArobas = value.indexOf("@") >= 0
        const sep1 = useArobas ? "@" : "-"
        const sep2 = useArobas ? "." : "-"
        const sep3 = "?"
        const i1 = value.indexOf(sep1)
        const i2 = i1 != -1 ? value.indexOf(sep2, i1 + 1) : -1
        const i3 = i2 != -1 ? value.indexOf(sep3, i2 + 1) : -1

        const queryParam = i3 != -1 ? value.substring(i3+1) : null
        value = i3 != -1 ? value.substring(0, i3) : value

        if (queryParam !== null && queryParam !== "scheduled") {
            result = null
        }
        else if (i1 != -1 && i2 != -1) { // 0.0.88-1640084590-665216882 or 0.0.88@1640084590.665216882 ?
            const s0 = value.substring(0, i1)
            const s1 = value.substring(i1 + 1, i2)
            const s2 = value.substring(i2 + 1)
            const v0 = EntityID.parse(s0)
            const v1 = EntityID.parsePositiveInt(s1)
            const v2 = EntityID.parsePositiveInt(s2)
            if (v0 == null || v1 == null || v2 == null) {
                result = null;
            } else {
                result = new TransactionID(v0, v1, v2, queryParam)
            }
        } else if (i1 != -1 && i2 == -1 && autoComplete) { // 0.0.88@1640084590 ?
            const s0 = value.substring(0, i1)
            const s1 = value.substring(i1 + 1)
            const v0 = EntityID.parse(s0)
            const v1 = EntityID.parsePositiveInt(s1)
            if (v0 == null || v1 == null) {
                result = null;
            } else {
                result = new TransactionID(v0, v1, 0, queryParam)
            }
        } else if (i1 == -1 && i2 == -1) { // 00881640084590665216882 ?
            // 00881640084590665216882
            // 0088 1640084590 665216882
            const i2 = value.length - 9
            const i1 = i2 - 10
            if (i1 >= 3) {
                const s0 = value.substring(0, i1)
                const s1 = value.substring(i1, i2)
                const s2 = value.substring(i2)
                if (s0.startsWith("00")) {
                    const v0 = EntityID.parse("0.0." + s0.substring(2))
                    const v1 = EntityID.parsePositiveInt(s1)
                    const v2 = EntityID.parsePositiveInt(s2)
                    if (v0 == null || v1 == null || v2 == null) {
                        result = null;
                    } else {
                        result = new TransactionID(v0, v1, v2, queryParam)
                    }
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

    public toString(useAtForm = true, addQueryParam = false): string {
        const sep1 = useAtForm ? "@" : "-"
        const sep2 = useAtForm ? "." : "-"
        let result = this.entityID.toString() + sep1 + this.seconds + sep2 + this.nanoSeconds.toString().padStart(9, '0')
        if (addQueryParam && this.queryParam !== null) {
            result += "?" + this.queryParam
        }
        return result
    }

    public static normalizeForDisplay(transactionID: string): string {
        return TransactionID.normalize(transactionID, TransactionID.useAtForm.value)
    }

    public static normalize(transactionID: string, useAtForm = false): string {
        const tid = TransactionID.parse(transactionID)
        return tid != null ? tid.toString(useAtForm) : transactionID
    }

    public static makePayerID(transactionID: string): string | null {
        const tid = TransactionID.parse(transactionID)
        return tid != null ? tid.entityID.toString() : null
    }

    public static useAtForm = computed(() => TransactionID.useAtFormRef.value)

    public static setUseAtForm(value: boolean): void {
        TransactionID.useAtFormRef.value = value
        AppStorage.setUseDashForm(!value)
    }

    //
    // Private
    //

    private static useAtFormRef = ref(!AppStorage.getUseDashForm())

    private constructor(entityID: EntityID, seconds: number, nanoSeconds: number, queryParam: string|null) {
        this.entityID = entityID
        this.seconds = seconds
        this.nanoSeconds = nanoSeconds
        this.queryParam = queryParam
    }


}
