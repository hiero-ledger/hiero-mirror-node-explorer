// SPDX-License-Identifier: Apache-2.0

import {DisassembledOpcodeOutput, Helpers} from './utils/helpers';

export class Disassembler {
    /**
     * @dev disassembles bytecode into EVM opcodes
     * @param bytecode: string
     * @return DisassembledOpcodeOutput[]
     */
    public static disassemble(bytecode: string) {
        const properBytecode = Helpers.prepBytecode(bytecode);
        if (!properBytecode) return null;
        const disassembly: DisassembledOpcodeOutput[] = [];

        for (let i = 0; i < properBytecode.length; i += 2) {
            const hex = properBytecode.substring(i, i + 2);
            const parsedOpcodeResult = Helpers.parseBytecode(properBytecode, hex, i);

            disassembly.push(parsedOpcodeResult.opcodeRepresentation);

            i = parsedOpcodeResult.index;
        }

        return disassembly;
    }
}
