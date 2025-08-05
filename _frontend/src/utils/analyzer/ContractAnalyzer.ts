// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, Ref, shallowRef, ShallowRef, watch, WatchStopHandle} from "vue";
import {SystemContractEntry, systemContractRegistry} from "@/schemas/SystemContractRegistry";
import {ethers} from "ethers";
import {SourcifyCache, SourcifyRecord, SourcifyResponseItem} from "@/utils/cache/SourcifyCache";
import {SolcMetadata} from "@/utils/solc/SolcMetadata";
import {ContractResponse, TokenInfo, TokenType} from "@/schemas/MirrorNodeSchemas";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import {EntityID} from "@/utils/EntityID";
import {AuxdataStyle, decode} from "@ethereum-sourcify/bytecode-utils";

export class ContractAnalyzer {

    public readonly contractId: Ref<string | null>
    public readonly report: ShallowRef<ContractAnalyzerReport|null> = shallowRef(null)

    private watchHandles: WatchStopHandle[] = []

    //
    // Public
    //

    public constructor(contractId: Ref<string | null>) {
        this.contractId = contractId
    }

    public mount(): void {
        this.watchHandles = [
            watch(this.contractId, this.analyze, {immediate: true}),
        ]
    }

    public unmount(): void {
        for (const wh of this.watchHandles) wh()
        this.watchHandles = []
        this.report.value = null
    }

    public readonly contractAddress = computed<string | null>(() => {
        let result: string | null
        if (this.report.value !== null) {
            if (this.report.value.contractInfo !== null) {
                result = this.report.value.contractInfo.evm_address ?? null
            } else if (this.report.value.tokenInfo !== null) {
                const tokenId = this.report.value.tokenInfo.token_id
                const eid = tokenId ? EntityID.parse(tokenId) : null
                result = eid?.toAddress() ?? null
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    })

    public readonly isSystemContract = computed(() => {
        const systemContractEntry = this.report.value?.systemContractEntry ?? null
        const tokenInfo = this.report.value?.tokenInfo ?? null
        return systemContractEntry !== null
            || tokenInfo !== null // Target is a token => IERC20 or IERC721
    })

    public readonly isVerified = computed(() => this.sourcifyURL.value != null)

    public readonly globalState = computed<GlobalState | null>(() => {
        let result: GlobalState | null
        if (this.contractId.value !== null) {
            if (this.report.value?.sourcifyRecord) {
                result = this.report.value.sourcifyRecord.fullMatch ? GlobalState.FullMatch : GlobalState.PartialMatch
            } else {
                result = GlobalState.Unverified
            }
        } else {
            result = null
        }
        return result
    })

    public readonly metadata: ComputedRef<SolcMetadata | null> = computed(() => {
        let result: SolcMetadata | null
        if (this.report.value?.sourcifyRecord) {
            result = SourcifyCache.fetchMetadata(this.report.value.sourcifyRecord.response)
        } else {
            result = null
        }
        return result
    })

    public readonly evmVersion: ComputedRef<string | null> = computed(() => {
        let result: string | null
        if (this.metadata.value !== null) {
            result = this.metadata.value.settings.evmVersion ?? null
        } else {
            result = null
        }
        return result
    })

    public readonly interface: ComputedRef<ethers.Interface | null> = computed(() => {
        let result: ethers.Interface | null
        if (this.report.value?.abi) {
            try {
                const i = new ethers.Interface(this.report.value.abi)
                result = Object.preventExtensions(i)
            } catch {
                result = null
            }
        } else {
            result = null
        }
        return result
    })

    public readonly sourceFileName: ComputedRef<string | null> = computed(() => {
        let result: string | null
        if (this.metadata.value !== null) {
            const target = this.metadata.value.settings.compilationTarget
            const keys = Object.keys(target)
            result = keys.length >= 1 ? keys[0] : null
        } else {
            result = null
        }
        return result
    })

    public readonly contractFileName = computed(() => {
        return this.sourceFileName.value?.substring(this.sourceFileName.value?.lastIndexOf('/') + 1)
    })

    public readonly contractName: ComputedRef<string | null> = computed(() => {
        let result: string | null

        if (this.report.value?.systemContractEntry) {
            result = null
        } else if (this.metadata.value !== null) {
            const target = this.metadata.value.settings.compilationTarget
            const keys = Object.keys(target)
            result = keys.length >= 1 ? target[keys[0]] : null
        } else {
            result = null
        }
        return result
    })

    public readonly solidityFiles = computed(() => {
        const result: Array<SourcifyResponseItem> = []
        const sourcifyRecord = this.report.value?.sourcifyRecord ?? null
        if (sourcifyRecord !== null && sourcifyRecord.response.files.length > 0) {
            const files = sourcifyRecord.response.files
            files?.forEach((f) => {
                const parts = f.name.split('.')
                const suffix = parts[parts.length - 1].toLowerCase()
                if (suffix !== "json") {
                    result.push(f)
                }
            })
        }
        return result
    })

    public readonly sourceFiles = computed(
        () => this.report.value?.sourcifyRecord?.response.files ?? [])

    //
    // public readonly sourceFileNames: ComputedRef<string[]> = computed(() => {
    //     let result: string[]
    //     if (this.systemContractEntry.value !== null) {
    //         result = []
    //     } else if (this.metadata.value !== null) {
    //         const sources = this.metadata.value.sources
    //         result = Object.keys(sources).sort()
    //     } else {
    //         result = []
    //     }
    //     return result
    // })

    //
    // Public (null if contractId is a system contract or a token)
    //

    public readonly solcVersion = computed(() => {
        let result: string|null
        if (this.byteCode.value !== null) {
            try {
                const decoding = decode(this.byteCode.value, AuxdataStyle.SOLIDITY)
                result = decoding.solcVersion ?? null
            } catch {
                result = null
            }
        } else {
            result = null
        }
        return result
    })

    public readonly byteCode: ComputedRef<string | null> = computed(() => {
        return this.report.value?.contractInfo?.runtime_bytecode ?? null
    })

    //
    // Public (null if contractId is not on Sourcify)
    //

    public readonly fullMatch: ComputedRef<boolean | null> = computed(
        () => this.report.value?.sourcifyRecord?.fullMatch ?? null)

    public readonly sourcifyURL: ComputedRef<string | null> = computed(
        () => this.report.value?.sourcifyRecord?.folderURL ?? null)


    //
    // Public (user actions)
    //

    public verifyDidComplete(): void {
        if (this.contractId.value !== null) {
            SourcifyCache.instance.forget(this.contractId.value)
            this.analyze().finally()
        }
    }

    //
    // Private
    //

    private readonly analyze = async () => {
        if (this.contractId.value !== null) {
            const e = systemContractRegistry.lookup(this.contractId.value)
            try {
                if (e !== null) {
                    // Contract is a system contract
                    this.report.value = await ContractAnalyzer.analyzeSystemContract(e)
                } else {
                    // In fact, contract id may identify a contract or a token. Let's see.
                    const contractInfo = await ContractByIdCache.instance.lookup(this.contractId.value)
                    if (contractInfo !== null) {
                        // Contract is a contract
                        this.report.value = await ContractAnalyzer.analyzeRegularContract(this.contractId.value, contractInfo)
                    } else {
                        const tokenInfo = await TokenInfoCache.instance.lookup(this.contractId.value)
                        if (tokenInfo !== null) {
                            // Contract is a token ERC20 or ERC721
                            this.report.value = await ContractAnalyzer.analyzeTokenContract(tokenInfo)
                        } else {
                            // Strange
                            this.report.value = {
                                systemContractEntry: null,
                                contractInfo: null,
                                sourcifyRecord: null,
                                tokenInfo: null,
                                abi: null,
                                reportError: null
                            }
                        }
                    }
                }
            } catch(error) {
                this.report.value = {
                    systemContractEntry: null,
                    contractInfo: null,
                    sourcifyRecord: null,
                    tokenInfo: null,
                    abi: null,
                    reportError: error
                }
            }
        } else {
            this.report.value = null
        }
    }

    private static async analyzeSystemContract(e: SystemContractEntry): Promise<ContractAnalyzerReport> {
        const abi = await e.loadABI()
        return {
            systemContractEntry: e,
            contractInfo: null,
            sourcifyRecord: null,
            tokenInfo: null,
            abi: abi,
            reportError: null
        }
    }

    private static async analyzeRegularContract(contractId: string, contractInfo: ContractResponse): Promise<ContractAnalyzerReport> {

        let sourcifyRecord: SourcifyRecord|null
        try {
            sourcifyRecord = await SourcifyCache.instance.lookup(contractId)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            sourcifyRecord = null
        }
        const metadata = sourcifyRecord !== null ? SourcifyCache.fetchMetadata(sourcifyRecord.response) : null
        const abi = metadata?.output.abi ?? null

        return {
            systemContractEntry: null,
            contractInfo: contractInfo,
            sourcifyRecord: sourcifyRecord,
            tokenInfo: null,
            abi: abi as ethers.Fragment[] | null,
            reportError: null
        }
    }

    private static async analyzeTokenContract(tokenInfo: TokenInfo): Promise<ContractAnalyzerReport> {

        let abiName: string | null
        switch (tokenInfo.type) {
            case TokenType.FUNGIBLE_COMMON:
                abiName = "IERC20+IHRC"
                break
            case TokenType.NON_FUNGIBLE_UNIQUE:
                abiName = "IERC721+IHRC"
                break
            default:
                abiName = null
                break
        }
        let abi: ethers.Fragment[] | null
        if (abiName !== null) {
            const m = await import(`@/assets/abi/${abiName}.json`)
            abi = m.default
        } else {
            abi = null
        }

        return {
            systemContractEntry: null,
            contractInfo: null,
            sourcifyRecord: null,
            tokenInfo: tokenInfo,
            abi: abi,
            reportError: null
        }
    }
}

export enum GlobalState {
    FullMatch, // Fully verified on sourcify
    PartialMatch, // Partially verified on sourcify
    Unverified // Unverified
}

export interface ContractAnalyzerReport {
    // System contract
    readonly systemContractEntry: SystemContractEntry|null

    // Regular contract
    readonly contractInfo: ContractResponse|null
    readonly sourcifyRecord: SourcifyRecord | null

    // Token contract
    readonly tokenInfo: TokenInfo|null

    // All
    readonly abi: ethers.Fragment[] | null
    readonly reportError: unknown|null
}
