// SPDX-License-Identifier: Apache-2.0

/*
  https://docs.soliditylang.org/en/latest/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode
 */

export interface SolcMetadata {

    // Required: Details about the compiler, contents are specific to the language.
    compiler: {
        // Optional: Hash of the compiler binary which produced this output
        keccak256?: string
        // Required for Solidity: Version of the compiler
        version: string
    }

    // Required: Source code language, basically selects a "sub-version" of the specification
    language: "Solidity"

    // Required: Generated information about the contract.
    output: {
        // Required: ABI definition of the contract. See "Contract ABI Specification"
        abi: unknown[],

        // Required: NatSpec developer documentation of the contract. See https://docs.soliditylang.org/en/latest/natspec-format.html for details.
        devdoc: NatSpec

        // Required: NatSpec user documentation of the contract. See "NatSpec Format"
        userdoc: NatSpec
    }

    // Required: Compiler settings. Reflects the settings in the JSON input during compilation.
    // Check the documentation of standard JSON input's "settings" field
    settings: {

        // Required for Solidity: File path and the name of the contract or library this
        // metadata is created for.
        compilationTarget: Record<string, string> // File Path -> Contract/Library Name

        // Required for Solidity.
        evmVersion: string

        // Required for Solidity: Addresses for libraries used.
        libraries: Record<string, string> // Library Name -> Address

        metadata: {
            // Reflects the setting used in the input json, defaults to "true"
            appendCBOR?: boolean
            // Reflects the setting used in the input json, defaults to "ipfs"
            bytecodeHash?: string
            // Reflects the setting used in the input json, defaults to "false"
            useLiteralContent?: boolean
        }

        // Optional: Optimizer settings. The fields "enabled" and "runs" are deprecated
        // and are only given for backwards-compatibility.
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

        // Required for Solidity: Sorted list of import remappings.
        remappings: string[]
    }

    // Required: Compilation source files/source units, keys are file paths
    sources: Record<string, ContractDescriptionV2>

    // Required: The version of the metadata format
    version: number // "1"
}

export interface NatSpec {
    // Contents of the @author NatSpec field of the contract
    author?: string

    // Contents of the @dev NatSpec field of the contract
    details?: string

    errors?: unknown
    events?: unknown

    kind: string, // "dev" or "user"

    methods?: unknown
    stateVariables?: unknown

    // Contents of the @title NatSpec field of the contract
    title?: string

    // NatSpec version
    version: number

    // Found in some Ethereum metadata
    notice?: string
}

export interface ContractDescriptionV2 {

    // Required: keccak256 hash of the source file
    keccak256: string

    // Required (unless "url" is used): literal contents of the source file
    content?: string

    // Required (unless "content" is used, see above): Sorted URL(s)
    // to the source file, protocol is more or less arbitrary, but an
    // IPFS URL is recommended
    urls?: string[]

    // Optional: SPDX license identifier as given in the source file
    license?: string,

}

/*


      {
        "compiler": {
          "version": "0.8.18+commit.87f61d96"
        },
        "language": "Solidity",                   // SolcInput
        "output": {
          "abi": [
            {
              "inputs": [],
              "name": "helloWorld",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            }
          ],
          "devdoc": {
            "kind": "dev",
            "methods": {},
            "version": 1
          },
          "userdoc": {
            "kind": "user",
            "methods": {},
            "version": 1
          }
        },
        "settings": {
          "compilationTarget": {
            "HelloWorld.sol": "HelloWorld"
          },
          "evmVersion": "paris",
          "libraries": {},
          "metadata": {
            "bytecodeHash": "ipfs"
          },
          "optimizer": {
            "enabled": false,
            "runs": 200
          },
          "remappings": []
        },
        "sources": {
          "HelloWorld.sol": {
            "keccak256": "0x861188eaf33869581b4c213e844f77e76103235d45e385963851f7464f713241",
            "license": "MIT",
            "urls": [
              "bzz-raw://53b897811163eda9f1543381c3f22445386cf2e7a5b565c7994c5666c7ef20ae",
              "dweb:/ipfs/QmbTQqGeZGYR2C2wTJb7sEazukoSMbunNHfBAT2Th3t4RP"
            ]
          }
        },
        "version": 1
      }

 */