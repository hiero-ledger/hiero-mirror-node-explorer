// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import {LabelDefinition, LabelDefinitionsCache} from "@/utils/cache/LabelDefinitionsCache.ts";

export class LabelByIdCache extends EntityCache<string, LabelDefinition | null> {

    public static readonly instance = new LabelByIdCache()

    protected async load(key: string): Promise<LabelDefinition | null> {
        return LabelDefinitionsCache.instance.lookupEntity(key)
    }
}

