// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios, {AxiosError} from "axios";
import {VerifiedContractsBuffer} from "@/utils/cache/VerifiedContractsBuffer";

export class VerifiedContractsByAccountIdCache extends EntityCache<string, VerifiedContractsBuffer | null> {

    public static readonly instance = new VerifiedContractsByAccountIdCache()

    protected async load(key: string): Promise<VerifiedContractsBuffer | null> {
        const buffer = new VerifiedContractsBuffer(key)
        await buffer.update().catch(this.errorHandler)
        return Promise.resolve(buffer)
    }

    private readonly errorHandler = (reason: unknown): void => {
        console.log("reason=" + reason)
        if (axios.isAxiosError(reason)) {
            const axiosError = reason as AxiosError
            console.log("url=" + axiosError.config?.url)
        }
    }
}
