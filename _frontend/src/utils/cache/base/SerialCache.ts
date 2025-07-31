// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"

export abstract class SerialCache<K, E> extends EntityCache<K, E> {

    private currentKey: K | null = null

    //
    // Cache
    //

    public async lookup(key: K, forceLoad = false): Promise<E> {
        let result: Promise<E>

        if (this.contains(key, forceLoad)) {
            result = super.lookup(key)
        } else {
            while (this.currentKey !== null) {
                await this.lookup(this.currentKey)
            }
            this.currentKey = key
            const p = super.lookup(key)
            try {
                result = Promise.resolve(await p)
            } finally {
                this.currentKey = null
            }
        }

        return result
    }

}

