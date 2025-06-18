// SPDX-License-Identifier: Apache-2.0

import {LabelPlacement} from "@/utils/cache/GeoLocationCache.ts";

export interface MapAnnotation {
    lat: number,
    lon: number,
    title: string[],
    placement?: LabelPlacement,
}
