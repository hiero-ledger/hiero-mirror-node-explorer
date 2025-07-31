// SPDX-License-Identifier: Apache-2.0


//
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-6963.md
//

import {EIP1193Provider} from "@/utils/wallet/eip1193";

export interface EIP6963ProviderInfo {
    rdns: string
    uuid: string
    name: string
    icon: string
}

export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo
    provider: EIP1193Provider
}

export type EIP6963AnnounceProviderEvent = {
    detail: {
        info: EIP6963ProviderInfo
        provider: Readonly<EIP1193Provider>
    }
}
