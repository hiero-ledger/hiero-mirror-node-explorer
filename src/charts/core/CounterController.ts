// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref, watch, WatchStopHandle} from "vue";
import axios, {AxiosRequestConfig} from "axios";
import {RouteManager} from "@/utils/RouteManager.ts";
import {EcosystemMetric} from "@/charts/hgraph/EcosystemMetric.ts";

export abstract class CounterController<M> {

    private readonly metric: Ref<M|null> = ref(null)
    private readonly loading: Ref<boolean> = ref(false)
    private readonly error: Ref<unknown> = ref(null)
    private watchHandle: WatchStopHandle|null = null

    //
    // Public
    //

    public mount(): void {
        this.watchHandle = watch(this.routeManager.currentNetworkEntry, this.updateMetric, {immediate: true})
    }

    public unmount(): void {
        if (this.watchHandle !== null) {
            this.watchHandle()
            this.watchHandle = null
        }
    }

    public readonly value = computed(() => {
        const m = this.metric.value
        return m !== null ? this.metricToValue(m) : ""
    })

    //
    // Protected
    //

    protected constructor(
        public readonly title: string,
        public readonly info: string,
        protected readonly routeManager: RouteManager) {}

    protected async loadData(): Promise<M|null> {
        throw "to be subclassed"
    }

    protected abstract metricToValue(m: M): string

    //
    // Private
    //

    private readonly updateMetric = async () => {
        this.loading.value = true
        try {
            this.metric.value = await this.loadData()
            this.error.value = null
        } catch(error) {
            this.metric.value = null
            this.error.value = error
        } finally {
            this.loading.value = false
        }
    }

}


interface TransactionAggregate {
    aggregate: {
        count: number
    }
}

interface GraphQLResponse {
    data?: {
        all_metrics?: EcosystemMetric[]
        transaction_aggregate?: TransactionAggregate
    }
    errors?: unknown[]
}

export class TransactionCounterController extends CounterController<TransactionAggregate> {

    public static readonly CONTRACT_CALL = 7
    public static readonly CONTRACT_CREATE = 8
    public static readonly CONTRACT_UPDATE = 9
    public static readonly ACCOUNT_CREATE = 11
    public static readonly ACCOUNT_DELETE = 12
    public static readonly CRYPTO_TRANSFER = 14
    public static readonly ACCOUNT_UPDATE = 15
    public static readonly CONTRACT_DELETE = 22
    public static readonly CREATE_TOPIC = 24
    public static readonly UPDATE_TOPIC = 25
    public static readonly DELETE_TOPIC = 26
    public static readonly SUBMIT_MESSAGE = 27
    public static readonly TOKEN_CREATE = 29
    public static readonly TOKEN_FREEZE = 31
    public static readonly TOKEN_UNFREEZE = 32
    public static readonly TOKEN_KYC_GRANT = 33
    public static readonly TOKEN_KYC_REVOKE = 34
    public static readonly TOKEN_DELETE = 35
    public static readonly TOKEN_UPDATE = 36
    public static readonly TOKEN_MINT = 37
    public static readonly TOKEN_BURN = 38
    public static readonly TOKEN_WIPE = 39
    public static readonly TOKEN_ASSOCIATE = 40
    public static readonly TOKEN_DISSOCIATE = 41
    public static readonly SCHEDULE_CREATE = 42
    public static readonly SCHEDULE_DELETE = 43
    public static readonly SCHEDULE_SIGN = 44
    public static readonly TOKEN_FEE_SCHEDULE_UPDATE = 45
    public static readonly TOKEN_PAUSE = 46
    public static readonly TOKEN_UNPAUSE = 47
    public static readonly APPROVE_ALLOWANCE = 48
    public static readonly DELETE_ALLOWANCE = 49
    public static readonly ETHEREUM_TRANSACTION = 50
    public static readonly NODE_STAKE_UPDATE = 51
    public static readonly PSEUDORANDOM_NUMBER_GENERATE = 52
    public static readonly UPDATE_NFTS = 53
    public static readonly NODE_DELETE = 56
    public static readonly TOKEN_REJECT = 57
    public static readonly TOKEN_AIRDROP = 58
    public static readonly CANCEL_AIRDROP = 59
    public static readonly CLAIM_AIRDROP = 60

    //
    // Public
    //

    public constructor(
        private readonly transactionType: number,
        title: string, info: string, routeManager: RouteManager) {
        super(title, info, routeManager)
    }

    //
    // CounterController
    //

    protected async loadData(): Promise<TransactionAggregate|null> {
        let result: TransactionAggregate|null

        const url = this.routeManager.hgraphURL.value
        if (url !== null) {
            const query = this.makeQuery(this.transactionType)
            result = await this.runQuery(url, query)
        } else {
            result = null
        }

        return Promise.resolve(result)
    }

    protected metricToValue(m: TransactionAggregate): string {
        return m.aggregate.count.toString()
    }


    //
    // Private
    //

    private makeConfig(): AxiosRequestConfig {
        let result: AxiosRequestConfig
        const hgraphKey = this.routeManager.hgraphKey.value
        if (hgraphKey !== null) {
            result = {
                headers: {
                    "X-API-KEY": hgraphKey
                }
            }
        } else {
            result = {}
        }
        return result
    }

    private async runQuery(url: string, query: string): Promise<TransactionAggregate|null> {
        let result: TransactionAggregate|null

        const config = this.makeConfig()
        const response = await axios.post<GraphQLResponse>(url, {query}, config)
        if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
            if (response.data.data) {
                result = response.data.data.transaction_aggregate ?? null
            } else {
                const errors = response.data.errors ?? []
                const error = errors.length >= 1 ? errors[0] : null
                throw error ?? "GraphQL query failed"
            }
        } else {
            throw "HTTP Error " + response.status
        }

        return Promise.resolve(result)
    }

    protected makeQuery(transactionType: number): string {
        return "{" +
            "  transaction_aggregate(where: {type: {_eq: \"" + transactionType + "\"}}) {" +
            "    aggregate {" +
            "      count" +
            "    }" +
            "  }" +
            "}"
    }

}

export class AccumulatedTransactionCounterController extends CounterController<number> {

    //
    // Public
    //

    public constructor(title: string, info: string, routeManager: RouteManager) {
        super(title, info, routeManager)
    }

    //
    // CounterController
    //

    protected async loadData(): Promise<number|null> {
        let result: number|null

        const url = this.routeManager.hgraphURL.value
        if (url !== null) {
            const query = this.makeQuery()
            result = await this.runQuery(url, query)
        } else {
            result = null
        }

        return Promise.resolve(result)
    }

    protected metricToValue(m: number): string {
        return m.toString()
    }

    //
    // Private
    //

    private makeConfig(): AxiosRequestConfig {
        let result: AxiosRequestConfig
        const hgraphKey = this.routeManager.hgraphKey.value
        if (hgraphKey !== null) {
            result = {
                headers: {
                    "X-API-KEY": hgraphKey
                }
            }
        } else {
            result = {}
        }
        return result
    }

    private async runQuery(url: string, query: string): Promise<number|null> {
        let result: number|null

        const config = this.makeConfig()
        const response = await axios.post<GraphQLResponse>(url, {query}, config)
        if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
            if (response.data.data) {
                const metrics = response.data.data.all_metrics ?? []
                // we accumulate
                result = 0
                for (const m of metrics) {
                    result += m.total
                }
            } else {
                const errors = response.data.errors ?? []
                const error = errors.length >= 1 ? errors[0] : null
                throw error ?? "GraphQL query failed"
            }
        } else {
            throw "HTTP Error " + response.status
        }

        return Promise.resolve(result)
    }

    protected makeQuery(): string {
        // We request all rows so that transformMetrics() can perform accumulation
        return "{" +
            "  all_metrics: ecosystem_metric(" +
            "    where: {" +
            "      name: {_eq: \"transactions\"}, " +
            "      period: {_eq: \"hour\"}," +
            "    }" +
            "    order_by: {end_date: asc}" +
            "  ) {" +
            "    start_date" +
            "    end_date" +
            "    total" +
            "  }" +
            "}"
    }
}