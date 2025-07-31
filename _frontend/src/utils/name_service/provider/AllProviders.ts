// SPDX-License-Identifier: Apache-2.0

import {NameServiceProvider} from "@/utils/name_service/provider/NameServiceProvider"
import {KNSProvider} from "@/utils/name_service/provider/KNSProvider"
import {HNSProvider} from "@/utils/name_service/provider/HNSProvider"

export const nameServiceProviders: NameServiceProvider[] = [
    new HNSProvider(),
    new KNSProvider()
]
