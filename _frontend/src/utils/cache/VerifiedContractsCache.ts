// SPDX-License-Identifier: Apache-2.0

import axios, {AxiosError} from "axios";
import {VerifiedContractsBuffer} from "@/utils/cache/VerifiedContractsBuffer";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";

export class VerifiedContractsCache extends SingletonCache<VerifiedContractsBuffer> {

    public static readonly instance = new VerifiedContractsCache()

    protected async load(): Promise<VerifiedContractsBuffer> {
        const buffer = new VerifiedContractsBuffer(null, 500)
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
