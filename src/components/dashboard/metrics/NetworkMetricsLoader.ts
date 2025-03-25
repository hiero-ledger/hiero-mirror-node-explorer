// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {computed} from "vue";
import {NetworkExchangeRateSetResponse, NetworkSupplyResponse} from "@/schemas/MirrorNodeSchemas";
import {EntityLoader} from "@/utils/loader/EntityLoader.ts";

export class NetworkMetricsLoader extends EntityLoader<NetworksMetrics> {

    //
    // Public
    //

    public constructor() {
        // Refresh every 10 min, forever
        super(60 * 10 * 1000, EntityLoader.HUGE_COUNT)
    }

    public readonly hbarPriceText = computed(() => {
        const v = this.hbarPrice.value
        return v !== null ? "$" + v.toFixed(4) : ""
    })

    public readonly hbarReleasedText = computed(() => {
        const v = this.hbarReleased.value
        return v !== null ? Number(v).toLocaleString('en-US') : ""
    })

    public readonly hbarTotalText = computed(() => {
        const v = this.hbarTotal.value
        return v !== null ? Number(v).toLocaleString('en-US') : ""
    })

    public readonly hbarMarketCapText = computed(() => {
        const v = this.hbarMarketCap.value
        return v !== null ? "$" + Number(v).toLocaleString("en-US") : ""
    })

    //
    // EntityCache
    //

    protected async load(): Promise<NetworksMetrics> {

        const timeNow = new Date().getTime()
        const time24 = timeNow - 24 * 3600 * 1000
        const paramsNow = {timestamp: timeNow / 1000}
        const params24 = {timestamp: time24 / 1000}

        const lastExchangeRate = (await axios.get<NetworkExchangeRateSetResponse>(
            "api/v1/network/exchangerate", {params: paramsNow})).data
        const lastExchangeRate24 = (await axios.get<NetworkExchangeRateSetResponse>(
            "api/v1/network/exchangerate", {params: params24})).data
        const lastSupply = (await axios.get<NetworkSupplyResponse>(
            "api/v1/network/supply", {params: paramsNow})).data
        const lastSupply24 = (await axios.get<NetworkSupplyResponse>(
            "api/v1/network/supply", {params: params24})).data

        return Promise.resolve(new NetworksMetrics(lastExchangeRate, lastExchangeRate24, lastSupply, lastSupply24))
    }

    //
    // Private
    //


    private readonly hbarPrice = computed(() => {
        const rate = this.entity.value?.lastExchangeRate?.current_rate
        return rate ? (Math.round(rate.cent_equivalent / rate.hbar_equivalent * 100) / 10000) : null
    })

    private readonly hbarReleased = computed(() => {
        const released = Number(this.entity.value?.lastSupply.released_supply)
        return released ? released / 100000000 : null
    })

    private readonly hbarTotal = computed(() => {
        const total = Number(this.entity.value?.lastSupply.total_supply)
        return total ? total / 100000000 : null
    })

    private readonly hbarMarketCap = computed(() => {
        const released = this.hbarReleased.value
        const price = this.hbarPrice.value
        return (released && price)
            ? Math.round(released * price)
            : null
    })
}

export class NetworksMetrics {

    constructor(
        readonly lastExchangeRate: NetworkExchangeRateSetResponse,
        readonly lastExchangeRate24: NetworkExchangeRateSetResponse,
        readonly lastSupply: NetworkSupplyResponse,
        readonly lastSupply24: NetworkSupplyResponse) {
    }

}

