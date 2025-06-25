// SPDX-License-Identifier: Apache-2.0

import {NetworkNode} from "@/schemas/MirrorNodeSchemas.ts";

export interface MarkerData {
    lat: number
    lon: number
    placeName: string
    nodes: NetworkNode[]
}
