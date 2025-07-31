// SPDX-License-Identifier: Apache-2.0

import {EVM_OPCODES, EvmOpcode} from './evm_opcodes';
import {hexToByte, utf8Encode} from "@/utils/B64Utils.ts";

export class Helpers {
    /**
     * @dev check if an opcode is a PUSH opcode
     * @param opcode
     * @returns
     */
    public static isPushOp(opcode: EvmOpcode): boolean {
        return opcode.mnemonic.includes('PUSH');
    }

    /**
     * @dev sanitizes & evaluates bytecode
     * @param bytecode
     * @returns string
     */
    public static prepBytecode(bytecode: string): string | null {
        // trim bytecode
        bytecode = bytecode.trim();

        // check if bytecode has valid length
        if (bytecode.length % 2 !== 0) return null;

        // omit 0x prefix
        if (bytecode.startsWith('0x')) {
            bytecode = bytecode.substring(2);
        }

        // remove cbor-encoded metadata if there are any
        bytecode = this.removeCBORMetadata(bytecode);

        // return trimmed and lower cased bytecode
        return bytecode.toLocaleLowerCase();
    }

    /**
     * @dev retrieves the operands for opcodes in PUSH family
     * @param opcode
     * @param bytecode
     * @param index
     * @returns string[]
     */
    public static getPushOperands(
        opcode: EvmOpcode,
        bytecode: string,
        index: number
    ) {
        const operandNum = opcode.operand;

        // @notice the opcode will push `operandNum` bytes (`operandNum` * 2 letters) to the operands array.
        //         Therefore, offset will skip the first byte of the opcodes and `operandNum` bytes of the operands
        const offset = index + operandNum * 2;

        const operandString = bytecode.substring(index + 2, offset + 2);

        const operands = [];

        for (let i = 0; i < operandString.length; i += 2) {
            operands.push(`${operandString.substring(i, i + 2)}`);
        }

        return {offset, operands};
    }

    public static INVALID_OPCODE_MNEMONIC = 'invalid'

    /**
     * @dev parses byte to get opcode
     * @param bytecode
     * @param hex
     * @param index
     * @return [index: string, mnemonic: string, operands: string]
     */
    public static parseBytecode(bytecode: string, hex: string, index: number) {
        const index16 = `0x${(index / 2).toString(16).padStart(4, '0')}`;

        const opcode = EVM_OPCODES.get(hex);

        if (!opcode) {
            return {
                index,
                opcodeRepresentation: {
                    index16,
                    hex,
                    mnemonic: Helpers.INVALID_OPCODE_MNEMONIC,
                    operand: [],
                } as DisassembledOpcodeOutput,
            };
        }

        if (Helpers.isPushOp(opcode)) {
            const result = Helpers.getPushOperands(opcode, bytecode, index);

            return {
                index: result.offset,
                opcodeRepresentation: {
                    index16,
                    hex,
                    mnemonic: opcode.mnemonic,
                    operand: result.operands,
                } as DisassembledOpcodeOutput,
            };
        } else {
            return {
                index,
                opcodeRepresentation: {
                    index16,
                    hex,
                    mnemonic: opcode.mnemonic,
                    operand: [],
                } as DisassembledOpcodeOutput,
            };
        }
    }

    /**
     * @dev removes swarm hash or ipfs hash CBOR-encoded metadata at the end of the bytecode if there's any
     * @notice the last 2 bytes of the bytecode may or may not indicate the length of the CBOR-encoded metadata of the bytecode.
     *         trace back to the begining of the encoded metadata using the last 2 bytes of the bytecode, the value of the first 6 bytes can be:
     *            - a165627a7a72 = !ebzzr (swarm hash)
     *            - a26469706673 = "dipfs (ipfs hash)
     *         If this is the case => bytecode has CBOR-encoded metadata at the end => remove
     */
    public static removeCBORMetadata(bytecode: string): string {
        const EXPECTED_SWARM_HEADER = 'bzzr';
        const EXPECTED_IPFS_HEADER = 'ipfs';

        // The last 2 bytes indicate the length of the metadata, but also contributes 2 bytes to the whole encoded metadata.
        // Therefore, the total length equals: indicated_length + 2
        const potentialMetadataLength =
            parseInt(`0x${bytecode.substring(bytecode.length - 4)}`) + 2;

        // bytecode with a valid CBOR encoded metadata would never be shorter than the length of a metadata. If this is the case, bytecode doesn't have metadata encoded at the end
        if (bytecode.length < potentialMetadataLength) return bytecode;

        // trace back to the begining of the encoded metadata, decode the first 6 bytes and check if they include the expected headers. If yes => remove, keep as-is otherwise.
        const potentialMetadataStartIndex =
            bytecode.length - potentialMetadataLength * 2;
        const metadataHeader = utf8Encode(hexToByte(
            bytecode.substring(
                potentialMetadataStartIndex,
                potentialMetadataStartIndex + 6 * 2 // 6 bytes * 2 chars
            )
        )!)

        if (
            metadataHeader.includes(EXPECTED_IPFS_HEADER) ||
            metadataHeader.indexOf(EXPECTED_SWARM_HEADER)
        ) {
            return bytecode.substring(0, potentialMetadataStartIndex);
        } else {
            return bytecode;
        }
    }
}

export interface DisassembledOpcodeOutput {
    index16: string,
    hex: string,
    mnemonic: string,
    operand: string[]
}
