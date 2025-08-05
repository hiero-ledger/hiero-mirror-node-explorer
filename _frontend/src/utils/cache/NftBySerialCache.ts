// SPDX-License-Identifier: Apache-2.0

import {Nft} from "@/schemas/MirrorNodeSchemas"
import axios from "axios"
import {SerialCache} from "./base/SerialCache"
import {computed, Ref} from "vue"
import {EntityLookup} from "./base/EntityCache"

export class NftBySerialCache extends SerialCache<string, Nft | null> {
    public static readonly instance = new NftBySerialCache()

    //
    // Cache
    //

    protected async load(tokenIdSerial: string): Promise<Nft | null> {
        let result: Promise<Nft | null>
        const tokenIdSerialArray = tokenIdSerial.split("---")
        try {
            const response = await axios.get<Nft>(
                `api/v1/tokens/${tokenIdSerialArray[0]}/nfts/${tokenIdSerialArray[1]}`,
            )
            result = Promise.resolve(response.data)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = Promise.resolve(null)
            } else {
                throw error
            }
        }
        return result
    }

    public makeNftLookup(
        tokenId: Ref<string | null>,
        serialNb: Ref<string | null>,
    ): EntityLookup<string, Nft | null> {
        const key = computed(() => {
            let result: string | null
            if (tokenId.value !== null && serialNb.value !== null) {
                result = tokenId.value + "---" + serialNb.value
            } else {
                result = null
            }
            return result
        })
        return this.makeLookup(key)
    }
}
