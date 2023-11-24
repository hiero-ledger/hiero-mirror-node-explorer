/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

export const DISASSEMBLER_TESTING_ASSETS = [
    {
      bytecode:
        '6080604052603e80600f5f395ff3fe60806040525f80fdfea2646970667358221220d8c7d282abb0ffe5ffaa3ade3e8405fff7c89ef4a3da325e2c9ea1c09924b7c264736f6c63430008150033',
      expectedDisassembly: [
        { index16: '0x0', hex: '60', mnemonic: 'PUSH1', operand: ['80'] },
        { index16: '0x4', hex: '60', mnemonic: 'PUSH1', operand: ['40'] },
        { index16: '0x8', hex: '52', mnemonic: 'MSTORE', operand: [] },
        { index16: '0xa', hex: '60', mnemonic: 'PUSH1', operand: ['3e'] },
        { index16: '0xe', hex: '80', mnemonic: 'DUP1', operand: [] },
        { index16: '0x10', hex: '60', mnemonic: 'PUSH1', operand: ['0f'] },
        { index16: '0x14', hex: '5f', mnemonic: 'PUSH0', operand: [] },
        { index16: '0x16', hex: '39', mnemonic: 'CODECOPY', operand: [] },
        { index16: '0x18', hex: '5f', mnemonic: 'PUSH0', operand: [] },
        { index16: '0x1a', hex: 'f3', mnemonic: 'RETURN', operand: [] },
        { index16: '0x1c', hex: 'fe', mnemonic: 'INVALID', operand: [] },
        { index16: '0x1e', hex: '60', mnemonic: 'PUSH1', operand: ['80'] },
        { index16: '0x22', hex: '60', mnemonic: 'PUSH1', operand: ['40'] },
        { index16: '0x26', hex: '52', mnemonic: 'MSTORE', operand: [] },
        { index16: '0x28', hex: '5f', mnemonic: 'PUSH0', operand: [] },
        { index16: '0x2a', hex: '80', mnemonic: 'DUP1', operand: [] },
        { index16: '0x2c', hex: 'fd', mnemonic: 'REVERT', operand: [] },
        { index16: '0x2e', hex: 'fe', mnemonic: 'INVALID', operand: [] },
        { index16: '0x30', hex: 'a2', mnemonic: 'LOG2', operand: [] },
        {
          index16: '0x32',
          hex: '64',
          mnemonic: 'PUSH5',
          operand: ['69', '70', '66', '73', '58'],
        },
        { index16: '0x3e', hex: '22', mnemonic: 'INVALID', operand: [] },
        { index16: '0x40', hex: '12', mnemonic: 'SLT', operand: [] },
        { index16: '0x42', hex: '20', mnemonic: 'SHA3', operand: [] },
        { index16: '0x44', hex: 'd8', mnemonic: 'INVALID', operand: [] },
        { index16: '0x46', hex: 'c7', mnemonic: 'INVALID', operand: [] },
        { index16: '0x48', hex: 'd2', mnemonic: 'INVALID', operand: [] },
        { index16: '0x4a', hex: '82', mnemonic: 'DUP3', operand: [] },
        { index16: '0x4c', hex: 'ab', mnemonic: 'INVALID', operand: [] },
        { index16: '0x4e', hex: 'b0', mnemonic: 'INVALID', operand: [] },
        { index16: '0x50', hex: 'ff', mnemonic: 'SELFDESTRUCT', operand: [] },
        { index16: '0x52', hex: 'e5', mnemonic: 'INVALID', operand: [] },
        { index16: '0x54', hex: 'ff', mnemonic: 'SELFDESTRUCT', operand: [] },
        { index16: '0x56', hex: 'aa', mnemonic: 'INVALID', operand: [] },
        { index16: '0x58', hex: '3a', mnemonic: 'GASPRICE', operand: [] },
        { index16: '0x5a', hex: 'de', mnemonic: 'INVALID', operand: [] },
        {
          index16: '0x5c',
          hex: '3e',
          mnemonic: 'RETURNDATACOPY',
          operand: [],
        },
        { index16: '0x5e', hex: '84', mnemonic: 'DUP5', operand: [] },
        { index16: '0x60', hex: '05', mnemonic: 'SDIV', operand: [] },
        { index16: '0x62', hex: 'ff', mnemonic: 'SELFDESTRUCT', operand: [] },
        { index16: '0x64', hex: 'f7', mnemonic: 'INVALID', operand: [] },
        { index16: '0x66', hex: 'c8', mnemonic: 'INVALID', operand: [] },
        { index16: '0x68', hex: '9e', mnemonic: 'SWAP15', operand: [] },
        { index16: '0x6a', hex: 'f4', mnemonic: 'DELEGATECALL', operand: [] },
        { index16: '0x6c', hex: 'a3', mnemonic: 'LOG3', operand: [] },
        { index16: '0x6e', hex: 'da', mnemonic: 'INVALID', operand: [] },
        { index16: '0x70', hex: '32', mnemonic: 'ORIGIN', operand: [] },
        { index16: '0x72', hex: '5e', mnemonic: 'INVALID', operand: [] },
        { index16: '0x74', hex: '2c', mnemonic: 'INVALID', operand: [] },
        { index16: '0x76', hex: '9e', mnemonic: 'SWAP15', operand: [] },
        { index16: '0x78', hex: 'a1', mnemonic: 'LOG1', operand: [] },
        { index16: '0x7a', hex: 'c0', mnemonic: 'INVALID', operand: [] },
        { index16: '0x7c', hex: '99', mnemonic: 'SWAP10', operand: [] },
        { index16: '0x7e', hex: '24', mnemonic: 'INVALID', operand: [] },
        { index16: '0x80', hex: 'b7', mnemonic: 'INVALID', operand: [] },
        { index16: '0x82', hex: 'c2', mnemonic: 'INVALID', operand: [] },
        {
          index16: '0x84',
          hex: '64',
          mnemonic: 'PUSH5',
          operand: ['73', '6f', '6c', '63', '43'],
        },
        { index16: '0x90', hex: '00', mnemonic: 'STOP', operand: [] },
        { index16: '0x92', hex: '08', mnemonic: 'ADDMOD', operand: [] },
        { index16: '0x94', hex: '15', mnemonic: 'ISZERO', operand: [] },
        { index16: '0x96', hex: '00', mnemonic: 'STOP', operand: [] },
        { index16: '0x98', hex: '33', mnemonic: 'CALLER', operand: [] },
      ],
    },
    {
      bytecode:
        '6080604052348015600e575f80fd5b50603e80601a5f395ff3fe60806040525f80fdfea264697066735822122050e5031fe7e93a1922e48aa845237cf82fc6f3ab36fc1a876ad6fbeda900307a64736f6c63430008150033',
      expectedDisassembly: [
        { index16: '0x0', hex: '60', mnemonic: 'PUSH1', operand: ['80'] },
        { index16: '0x4', hex: '60', mnemonic: 'PUSH1', operand: ['40'] },
        { index16: '0x8', hex: '52', mnemonic: 'MSTORE', operand: [] },
        { index16: '0xa', hex: '34', mnemonic: 'CALLVALUE', operand: [] },
        { index16: '0xc', hex: '80', mnemonic: 'DUP1', operand: [] },
        { index16: '0xe', hex: '15', mnemonic: 'ISZERO', operand: [] },
        { index16: '0x10', hex: '60', mnemonic: 'PUSH1', operand: ['0e'] },
        { index16: '0x14', hex: '57', mnemonic: 'JUMPI', operand: [] },
        { index16: '0x16', hex: '5f', mnemonic: 'PUSH0', operand: [] },
        { index16: '0x18', hex: '80', mnemonic: 'DUP1', operand: [] },
        { index16: '0x1a', hex: 'fd', mnemonic: 'REVERT', operand: [] },
        { index16: '0x1c', hex: '5b', mnemonic: 'JUMPDEST', operand: [] },
        { index16: '0x1e', hex: '50', mnemonic: 'POP', operand: [] },
        { index16: '0x20', hex: '60', mnemonic: 'PUSH1', operand: ['3e'] },
        { index16: '0x24', hex: '80', mnemonic: 'DUP1', operand: [] },
        { index16: '0x26', hex: '60', mnemonic: 'PUSH1', operand: ['1a'] },
        { index16: '0x2a', hex: '5f', mnemonic: 'PUSH0', operand: [] },
        { index16: '0x2c', hex: '39', mnemonic: 'CODECOPY', operand: [] },
        { index16: '0x2e', hex: '5f', mnemonic: 'PUSH0', operand: [] },
        { index16: '0x30', hex: 'f3', mnemonic: 'RETURN', operand: [] },
        { index16: '0x32', hex: 'fe', mnemonic: 'INVALID', operand: [] },
        { index16: '0x34', hex: '60', mnemonic: 'PUSH1', operand: ['80'] },
        { index16: '0x38', hex: '60', mnemonic: 'PUSH1', operand: ['40'] },
        { index16: '0x3c', hex: '52', mnemonic: 'MSTORE', operand: [] },
        { index16: '0x3e', hex: '5f', mnemonic: 'PUSH0', operand: [] },
        { index16: '0x40', hex: '80', mnemonic: 'DUP1', operand: [] },
        { index16: '0x42', hex: 'fd', mnemonic: 'REVERT', operand: [] },
        { index16: '0x44', hex: 'fe', mnemonic: 'INVALID', operand: [] },
        { index16: '0x46', hex: 'a2', mnemonic: 'LOG2', operand: [] },
        {
          index16: '0x48',
          hex: '64',
          mnemonic: 'PUSH5',
          operand: ['69', '70', '66', '73', '58'],
        },
        { index16: '0x54', hex: '22', mnemonic: 'INVALID', operand: [] },
        { index16: '0x56', hex: '12', mnemonic: 'SLT', operand: [] },
        { index16: '0x58', hex: '20', mnemonic: 'SHA3', operand: [] },
        { index16: '0x5a', hex: '50', mnemonic: 'POP', operand: [] },
        { index16: '0x5c', hex: 'e5', mnemonic: 'INVALID', operand: [] },
        { index16: '0x5e', hex: '03', mnemonic: 'SUB', operand: [] },
        { index16: '0x60', hex: '1f', mnemonic: 'INVALID', operand: [] },
        { index16: '0x62', hex: 'e7', mnemonic: 'INVALID', operand: [] },
        { index16: '0x64', hex: 'e9', mnemonic: 'INVALID', operand: [] },
        { index16: '0x66', hex: '3a', mnemonic: 'GASPRICE', operand: [] },
        { index16: '0x68', hex: '19', mnemonic: 'NOT', operand: [] },
        { index16: '0x6a', hex: '22', mnemonic: 'INVALID', operand: [] },
        { index16: '0x6c', hex: 'e4', mnemonic: 'INVALID', operand: [] },
        { index16: '0x6e', hex: '8a', mnemonic: 'DUP111', operand: [] },
        { index16: '0x70', hex: 'a8', mnemonic: 'INVALID', operand: [] },
        { index16: '0x72', hex: '45', mnemonic: 'GASLIMIT', operand: [] },
        { index16: '0x74', hex: '23', mnemonic: 'INVALID', operand: [] },
        {
          index16: '0x76',
          hex: '7c',
          mnemonic: 'PUSH29',
          operand: [
            'f8',
            '2f',
            'c6',
            'f3',
            'ab',
            '36',
            'fc',
            '1a',
            '87',
            '6a',
            'd6',
            'fb',
            'ed',
            'a9',
            '00',
            '30',
            '7a',
            '64',
            '73',
            '6f',
            '6c',
            '63',
            '43',
            '00',
            '08',
            '15',
            '00',
            '33',
          ],
        },
      ],
    },
];
