// SPDX-License-Identifier: Apache-2.0

/*
    Reference documents:

    https://docs.soliditylang.org/en/latest/using-the-compiler.html#

 */

export interface SolcOutput {

    // Optional: not present if no errors/warnings/infos were encountered
    errors?: ErrorDescription[]
    // This contains the contract-level outputs.
    // It can be limited/filtered by the outputSelection settings.
    contracts?: Record<string, Record<string, ContractDescription>>
}


export interface ErrorDescription {
    // Optional: Location within the source file.
    sourceLocation?: SourceLocation
    // Optional: Further locations (e.g. places of conflicting declarations)
    secondarySourceLocations?: SourceLocation
    // Mandatory: Error type, such as "TypeError", "InternalCompilerError", "Exception", etc.
    // See below for complete list of types.
    type: string,
    // Mandatory: Component where the error originated, such as "general", "ewasm", etc.
    component: string,
    // Mandatory ("error", "warning" or "info", but please note that this may be extended in the future)
    severity: string,
    // Optional: unique code for the cause of the error
    errorCode?: string,
    // Mandatory
    message: string,
    // Optional: the message formatted with source location
    formattedMessage?: string
}

export interface SourceLocation {
    file: string,
    start: number,
    end: number
}

export interface ContractDescription {
    // The Ethereum Contract ABI. If empty, it is represented as an empty array.
    // See https://docs.soliditylang.org/en/develop/abi-spec.html
    abi?: [],
    // EVM-related outputs
    evm?: EvmDescription
}

export interface EvmDescription {
    bytecode: BytecodeDescription
    deployedBytecode: BytecodeDescription,
}

export interface BytecodeDescription {
    // The bytecode as a hex string.
    object: string
}


//
// Tools
//

