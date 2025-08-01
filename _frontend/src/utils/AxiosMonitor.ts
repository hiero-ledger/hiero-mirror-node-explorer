// SPDX-License-Identifier: Apache-2.0

import axios, {Axios, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {ref} from "vue";

export class AxiosMonitor {

    public static readonly instance = new AxiosMonitor()

    public readonly loading = ref(false)
    public readonly initialLoading = ref(false)
    public readonly error = ref(false)
    public readonly explanation = ref("")
    public readonly suggestion = ref("")

    private targetAxios: Axios | null = null
    private requestInterceptor: number | null = null
    private responseInterceptor: number | null = null
    private activeRequestCount = 0
    private successfulRequestCount = 0
    private idlePeriodCount = 0
    private errorResponses = new Map<string, unknown>()

    //
    // Public
    //

    public setTargetAxios(newValue: Axios | null): void {
        if (this.targetAxios !== null) {
            if (this.requestInterceptor !== null) {
                this.targetAxios.interceptors.request.eject(this.requestInterceptor)
                this.requestInterceptor = null
            }
            if (this.responseInterceptor !== null) {
                this.targetAxios.interceptors.response.eject(this.responseInterceptor)
                this.responseInterceptor = null
            }
        }
        this.targetAxios = newValue
        if (this.targetAxios !== null) {

            this.requestInterceptor = this.targetAxios.interceptors.request.use(
                (value: InternalAxiosRequestConfig) => this.requestIntercepted(value))

            this.responseInterceptor = this.targetAxios.interceptors.response.use(
                (response: AxiosResponse) => this.requestFullfilled(response),
                (reason: unknown) => this.requestRejected(reason))
        }
    }

    public clearErrorResponses(): void {
        if (this.errorResponses.size >= 1) {
            console.log("Clearing " + this.errorResponses.size + " error responses")
            this.errorResponses.clear()
            this.successfulRequestCount = 0
            this.stateDidChange()
        }
        this.idlePeriodCount = 0
    }

    public makeExplanationOrSuggestion(explanation: boolean): string {

        let errorCount_request = 0
        let errorCount_429 = 0


        const statusCodes = new Set<number>()
        for (const error of this.errorResponses.values()) {

            // See https://axios-http.com/docs/handling_errors

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status == 429) {
                        errorCount_429 += 1
                    } else {
                        statusCodes.add(error.response.status)
                    }
                } else {
                    errorCount_request += 1
                }
            }
        }

        let result: string
        const errorCount = this.errorResponses.size
        if (errorCount_429 >= 1) {
            // At least one request failed with http status #429
            result = explanation
                ? "The server is busy (status #429)"
                : "This is transient. Try to reload the page in a few moments."
        } else if (errorCount_request === errorCount) {
            // Failed requests do not have any response from server
            if (this.successfulRequestCount >= 1) {
                // Some requests did succeed => server overload ?
                result = explanation
                    ? "The server is busy"
                    : "This is transient. Try to reload the page in a few moments."
            } else {
                // No request did succeed => internet connection is dead ?
                result = explanation
                    ? "Internet connection issue ?"
                    : "Check your internet connection and reload the page."
            }
        } else {
            // Other cases
            if (statusCodes.size == 1) {
                // All requests returns the same http status
                const statusCode = statusCodes.values().next().value
                result = explanation
                    ? "The server reported an error #" + statusCode
                    : "This might be transient. Try to reload the page in a few moments."
            } else {
                result = explanation
                    ? "The server reported errors"
                    : "This might be transient. Try to reload the page in a few moments."
            }
        }

        return result
    }

    //
    // Private
    //

    private requestIntercepted(value: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig {
        this.activeRequestCount += 1
        this.stateDidChange()
        return value
    }

    private requestFullfilled(response: AxiosResponse): Promise<AxiosResponse> {
        let result: Promise<AxiosResponse>
        if (this.targetAxios !== null) {
            this.activeRequestCount -= 1
            this.idlePeriodCount += this.activeRequestCount == 0 ? +1 : 0
            this.successfulRequestCount += 1
            this.errorResponses.delete(this.targetAxios.getUri(response.config))
            this.stateDidChange()
            result = Promise.resolve(response)
        } else {
            throw "AxiosMonitor.targetAxios should not be null : BUG"
        }
        return result
    }

    private requestRejected(reason: unknown): unknown {
        let result: unknown
        if (this.targetAxios !== null) {
            this.activeRequestCount -= 1
            this.idlePeriodCount += this.activeRequestCount == 0 ? +1 : 0
            if (axios.isAxiosError(reason) && reason.request?.status != 404) {
                this.errorResponses.set(this.targetAxios.getUri(reason.config), reason)
            }
            this.stateDidChange()
            result = Promise.reject(reason)
        } else {
            throw "AxiosMonitor.targetAxios should not be null : BUG"
        }
        return result
    }

    private stateDidChange(): void {
        this.loading.value = this.activeRequestCount >= 1
        this.initialLoading.value = this.activeRequestCount >= 1 && this.idlePeriodCount == 0
        this.error.value = this.errorResponses.size >= 1
        this.explanation.value = this.makeExplanationOrSuggestion(true)
        this.suggestion.value = this.makeExplanationOrSuggestion(false)
    }
}