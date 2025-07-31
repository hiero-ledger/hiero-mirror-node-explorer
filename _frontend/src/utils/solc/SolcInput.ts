// SPDX-License-Identifier: Apache-2.0

/*
    Reference documents:

    https://docs.soliditylang.org/en/latest/using-the-compiler.html#

 */

export interface SolcInput {

    // Reference
    //      https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description

    // Required: Source code language. Currently supported are "Solidity" and "Yul".
    language: string,

    // Required
    sources: Record<string, SourceInput>

    // Optional
    settings?: InputSettings
}

export interface SourceInput {
    keccak256?: string
    urls?: string[]
    content?: string
}

export interface InputSettings {
    remappings?: string[]
    outputSelection: Record<string, Record<string, string[]>>
    optimizer?: {
        details?: {
            constantOptimizer?: boolean,
            cse?: boolean,
            deduplicate?: boolean,
            // inliner defaults to "true"
            inliner?: boolean,
            // jumpdestRemover defaults to "true"
            jumpdestRemover?: boolean,
            orderLiterals?: boolean,
            // peephole defaults to "true"
            peephole?: boolean,
            yul?: boolean,
            // Optional: Only present if "yul" is "true"
            yulDetails?: {
                optimizerSteps?: string,
                stackAllocation?: boolean
            }
        },
        enabled?: boolean,
        runs?: number
    }
}
