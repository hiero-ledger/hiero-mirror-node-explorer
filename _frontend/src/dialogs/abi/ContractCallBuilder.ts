// SPDX-License-Identifier: Apache-2.0

import {computed, ref, watch} from "vue";
import {ethers} from "ethers";
import {AppStorage} from "@/AppStorage.ts";
import {ContractCallRequest, ContractCallResponse, extractMessageFromErrorBody} from "@/schemas/MirrorNodeSchemas.ts";
import axios from "axios";
import {ABIController} from "@/components/contract/ABIController.ts";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class ContractCallBuilder {

    public readonly fragment: ethers.FunctionFragment
    public readonly abiController: ABIController
    public readonly paramBuilders: ContractParamBuilder[]
    public readonly payableValueBuilder: ContractParamBuilder|null

    public readonly lastValue = ref<ethers.Result | null>(null)
    public readonly lastError = ref<unknown | null>(null)

    //
    // Public
    //

    public constructor(fragment: ethers.FunctionFragment, abiController: ABIController) {
        this.fragment = fragment
        this.abiController = abiController
        this.paramBuilders = []
        for (const i of this.fragment.inputs) {
            this.paramBuilders.push(new ContractParamBuilder(i, this))
        }
        if (this.fragment.payable) {
            // We add an extra build for "value" parameter
            const payableParamType = ethers.ParamType.from({
                name: "value",
                type: "uint",
                baseType: "uint",
                indexed: null,
                components: null,
                arrayLength: null,
                arrayChildren: null
            })
            this.payableValueBuilder = new ContractParamBuilder(payableParamType, this)
        } else {
            this.payableValueBuilder = null
        }
    }

    public readonly functionData = computed(() => {
        const paramDataList: unknown[] = []
        for (const b of this.paramBuilders) {
            const paramData = b.paramData.value
            if (paramData !== null) {
                paramDataList.push(paramData)
            }
        }

        let result: string | null
        const paramOK = paramDataList.length == this.paramBuilders.length
        const itf = this.abiController.targetInterface.value
        if (itf !== null && paramOK) {
            try {
                result = itf.encodeFunctionData(this.fragment, paramDataList)
            } catch {
                result = null
            }
        } else {
            result = null
        }
        return result
    })

    public readonly isGetter =
        () => this.fragment.stateMutability == "view"
            && this.fragment.inputs.length == 0
            && this.fragment.outputs.length >= 1

    public readonly isReadOnly =
        () => this.fragment.stateMutability == "view"
            || this.fragment.stateMutability == "pure"

    public readonly hasResult =
        () => this.fragment.outputs.length >= 1

    public readonly callOutput = computed(() => {
        let result: string
        const lastValue = this.lastValue.value
        const lastError = this.lastError.value
        if (lastError !== null) {
            if (axios.isAxiosError(lastError) && lastError.status == 400) {
                result = extractMessageFromErrorBody(lastError.response?.data) ?? lastError.toString()
            } else {
                result = lastError?.toString() ?? "Undefined error"
            }
        } else if (lastValue !== null) {
            try {
                result = JSON.stringify(lastValue.length == 1 ? lastValue[0] : lastValue)
            } catch {
                result = lastValue.toString()
            }
        } else {
            result = " "
        }
        return result
    })

    public readonly payableValue = computed(() => {
        let result: string|null
        if (this.payableValueBuilder !== null && this.payableValueBuilder.paramData.value !== null) {
            try {
                result = ethers.AbiCoder.defaultAbiCoder().encode(
                    [this.payableValueBuilder.paramType],
                    [this.payableValueBuilder.paramData.value])
            } catch {
                result = null
            }
        } else {
            result = null
        }
        return result
    })

    public async execute(): Promise<void> {
        const contractId = this.abiController.abiAnalyzer.contractAnalyzer.contractId.value
        const itf = this.abiController.targetInterface.value
        const functionData = this.functionData.value
        const payableValue = this.payableValue.value
        if (contractId !== null && itf !== null && functionData !== null) {
            try {
                let response: string | null
                if (this.isReadOnly()) {
                    response = await ContractCallBuilder.executeWithMirrorNode(contractId, functionData, payableValue)
                } else {
                    response = await ContractCallBuilder.executeWithWallet(contractId, functionData, payableValue)
                }
                this.lastValue.value = response !== null ? itf.decodeFunctionResult(this.fragment, response) : null
                this.lastError.value = null
            } catch (reason) {
                this.lastValue.value = null
                this.lastError.value = reason
            }
        } else {
            this.lastValue.value = null
            this.lastError.value = null
        }
        return Promise.resolve()
    }

    public saveInputParams() {
        for (const b of this.paramBuilders) {
            if (b.paramData.value) {
                AppStorage.setInputParam(b.paramData.value, this.fragment.selector, b.paramType.name)
            }
        }
        if (this.payableValueBuilder !== null) {
            AppStorage.setInputParam(
                this.payableValueBuilder.paramData.value,
                this.fragment.selector,
                this.payableValueBuilder.paramType.name)
        }
    }

    //
    // Private
    //

    private static async executeWithMirrorNode(contractId: string, functionData: string, value: string|null): Promise<string> {
        const url = "api/v1/contracts/call"
        const contractAddress = await ContractByIdCache.instance.findContractAddress(contractId) ?? contractId
        const body: ContractCallRequest = {
            data: functionData,
            to: contractAddress,
        }
        if (value !== null) {
            body.value = ethers.getNumber(value)
        }
        const response = await axios.post<ContractCallResponse>(url, body)
        return response.data.result
    }


    private static async executeWithWallet(contractId: string, functionData: string, value: string|null): Promise<string | null> {
        const callResult = await walletManager.callContract(contractId, functionData, value)
        return typeof callResult == "string" ? null : callResult.call_result
    }

}

export class ContractParamBuilder {

    public readonly paramType: ethers.ParamType
    public readonly callBuilder: ContractCallBuilder
    public readonly paramData = ref<unknown | null>(null)
    public readonly encodingError = ref<unknown | null>(null)

    public constructor(paramType: ethers.ParamType, callBuilder: ContractCallBuilder) {
        this.paramType = paramType
        this.callBuilder = callBuilder
        watch(this.paramData, this.updateEncodingError)
    }

    private readonly updateEncodingError = () => {
        if (this.paramData.value !== null) {
            try {
                ethers.AbiCoder.defaultAbiCoder().encode([this.paramType], [this.paramData.value])
                this.encodingError.value = null
            } catch (reason) {
                this.encodingError.value = reason
            }
        } else {
            this.encodingError.value = null
        }
    }
}
