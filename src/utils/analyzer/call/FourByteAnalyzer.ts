// SPDX-License-Identifier: Apache-2.0

import {Ref, shallowRef, watch, WatchStopHandle} from "vue";
import {SignatureCache, SignatureRecord} from "@/utils/cache/SignatureCache.ts";
import {ethers} from "ethers";

export class FourByteAnalyzer {

    public readonly fragment = shallowRef<ethers.FunctionFragment | ethers.ConstructorFragment | null>(null)
    private watchHandle: WatchStopHandle|null = null


    //
    // Public
    //

    public constructor(
        private readonly functionHash: Ref<string|null>,
        private readonly functionParams: Ref<string|null>,
        private readonly enabled: Ref<boolean>) {}


    public mount(): void {
        this.watchHandle = watch([this.functionHash, this.functionParams, this.enabled], this.analyze, {immediate: true})
    }

    public unmount(): void {
        if (this.watchHandle !== null) {
            this.watchHandle()
            this.watchHandle = null
        }
        this.fragment.value = null
    }

    //
    // Private
    //

    private readonly analyze = async () => {
        const h = this.functionHash.value
        const p = this.functionParams.value

        if (h !== null && p !== null && this.enabled.value) {
            this.fragment.value = await FourByteAnalyzer.search4bytes(h, p)
        } else {
            this.fragment.value = null
        }
    }

    //
    // Private (4byte)
    //

    private static async search4bytes(functionHash: string, callParams: string): Promise<ethers.FunctionFragment|null> {
        let result: ethers.FunctionFragment|null
        const r = await SignatureCache.instance.lookup(functionHash)
        if (r !== null) {
            const r0 = FourByteAnalyzer.resolveSignatureCollisions(r.results, callParams)
            if (r0 !== null) {
                result = ethers.FunctionFragment.from(r0.text_signature)
            } else {
                result = null
            }
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

    private static resolveSignatureCollisions(records: SignatureRecord[], callParams: string): SignatureRecord | null {
        //
        // Some selectors (like 0x70a08231) have multiple signatures registered on 4bytes.directory.
        // We select the first signature which enables to decode inputArgs.
        //
        let result: SignatureRecord | null = null
        for (const r of records) {
            try {
                const ff = ethers.FunctionFragment.from(r.text_signature)
                const decodedArgs = ethers.AbiCoder.defaultAbiCoder().decode(ff.inputs, callParams)
                const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(ff.inputs, decodedArgs)
                if (encodedArgs == callParams) {
                    result = r
                    break
                }
            } catch {
                // Ignored
            }
        }
        return result
    }
}
