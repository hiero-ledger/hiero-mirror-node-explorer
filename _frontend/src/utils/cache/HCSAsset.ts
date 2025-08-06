// SPDX-License-Identifier: Apache-2.0

import {TopicMessage} from "@/schemas/MirrorNodeSchemas";
import {decompress, init} from "@bokuweb/zstd-wasm";
import {decompress as brotliDecompress} from "brotli-compress"
import {base64Decode, base64Encode, byteToHex} from "@/utils/B64Utils.ts";
import {HCSAssetFragment} from "@/utils/HCSAssetFragment.ts";
import {getDataURLType} from "@/utils/URLUtils.ts";

export class HCSAsset {
    protected constructor(
        public readonly type: string | null,            // MIME type
        public readonly content: Uint8Array | null,
        public readonly hash: string | null,            // SHA-256 in hexa
    ) {
    }

    public getDataURL(): string | null {
        let result: string | null
        if (this.type !== null && this.content !== null) {
            const dataPrefix = `data:${this.type};base64,`
            const urlContent = base64Encode(this.content)
            result = dataPrefix + urlContent
        } else {
            result = null
        }
        return result
    }

    public static isCompressionAlgoSupported(algo: string): boolean {
        return algo === 'zstd' || algo === 'brotli'
    }

    public static async reassemble(messages: TopicMessage[], assetComplete: boolean, algo: string = 'zstd'): Promise<HCSAsset | null> {
        let result: HCSAsset | null

        const fragments: HCSAssetFragment[] = []
        for (const m of messages) {
            const fragment = HCSAssetFragment.parse(m)
            if (fragment !== null) {
                fragments.push(fragment)
            }
        }
        if (fragments.length >= 1 && this.isCompressionAlgoSupported(algo)) {
            fragments.sort((a, b) => a.index - b.index)
            let assembledContent = ""
            for (const f of fragments) {
                assembledContent += f.content
            }
            if (fragments[0].index === 0) {
                // Extract the mime type
                const assetType = getDataURLType(assembledContent)
                if (assetComplete) {
                    // Skip the data prefix
                    assembledContent = assembledContent.substring(assembledContent.indexOf(',') + 1)
                    // Decode from Base64
                    const compressedContent = base64Decode(assembledContent)
                    let assetContent: Uint8Array

                    switch (algo) {
                        case 'brotli':
                            assetContent = await brotliDecompress(compressedContent);
                            break;
                        case 'zstd':
                        default:
                            if (!this.isInitialized) {
                                await init()
                                this.isInitialized = true
                            }
                            assetContent = decompress(compressedContent)
                    }

                    const assetHash = await window.crypto.subtle.digest("SHA-256", assetContent as BufferSource);
                    result = new HCSAsset(assetType, assetContent, byteToHex(new Uint8Array(assetHash)))
                } else { // asset is incomplete
                    result = new HCSAsset(assetType, null, null)
                }
            } else { // asset is incomplete, and we do not hold its first fragment -- it is unusable
                result = null
            }
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

    private static isInitialized = false
}
