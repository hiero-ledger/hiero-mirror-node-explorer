// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test, vi} from 'vitest'
import {ethers} from 'ethers'
import {FourByteAnalyzer} from '@/utils/analyzer/call/FourByteAnalyzer'
import {SignatureCache, type SignatureRecord, type SignatureResponse} from '@/utils/cache/SignatureCache'

const buildCallParams = (): string => {
    const address = '0x1111111111111111111111111111111111111111'
    const amount = 1_000_000_000_000_000_000n
    return ethers.AbiCoder.defaultAbiCoder().encode(['address', 'uint256'], [address, amount])
}

describe('FourByteAnalyzer', () => {
    test('resolveSignatureCollisions picks transfer(address,uint256) without mutating the input order', async () => {
        const records: SignatureRecord[] = [
            {id: 31780, created_at: '', text_signature: 'many_msg_babbage(bytes1)', hex_signature: '0x', bytes_signature: ''},
            {id: 145, created_at: '', text_signature: 'transfer(address,uint256)', hex_signature: '0xa9059cbb', bytes_signature: ''},
            {id: 161159, created_at: '', text_signature: 'transfer(bytes4[9],bytes5[6],int48[11])', hex_signature: '0x', bytes_signature: ''},
            {id: 313067, created_at: '', text_signature: 'func_2093253501(bytes)', hex_signature: '0x', bytes_signature: ''},
            {id: 844280, created_at: '', text_signature: 'join_tg_invmru_haha_fd06787(address,bool)', hex_signature: '0x', bytes_signature: ''},
            {id: 1111734, created_at: '', text_signature: 'workMyDirefulOwner(uint256,uint256)', hex_signature: '0x', bytes_signature: ''},
        ]
        const originalOrder = records.map((record) => record.id)

        const selected = (FourByteAnalyzer as any).resolveSignatureCollisions(records, buildCallParams())

        expect(selected?.text_signature).toBe('transfer(address,uint256)')
        expect(records.map((record) => record.id)).toEqual(originalOrder)
    })

    test('search4bytes resolves the selector to transfer(address,uint256)', async () => {
        const records: SignatureRecord[] = [
            {id: 31780, created_at: '', text_signature: 'many_msg_babbage(bytes1)', hex_signature: '0x', bytes_signature: ''},
            {id: 145, created_at: '', text_signature: 'transfer(address,uint256)', hex_signature: '0xa9059cbb', bytes_signature: ''},
            {id: 161159, created_at: '', text_signature: 'transfer(bytes4[9],bytes5[6],int48[11])', hex_signature: '0x', bytes_signature: ''},
            {id: 313067, created_at: '', text_signature: 'func_2093253501(bytes)', hex_signature: '0x', bytes_signature: ''},
            {id: 844280, created_at: '', text_signature: 'join_tg_invmru_haha_fd06787(address,bool)', hex_signature: '0x', bytes_signature: ''},
            {id: 1111734, created_at: '', text_signature: 'workMyDirefulOwner(uint256,uint256)', hex_signature: '0x', bytes_signature: ''},
        ]
        const response: SignatureResponse = {
            count: records.length,
            next: null,
            previous: null,
            results: records,
        }

        const lookupSpy = vi.spyOn(SignatureCache.instance, 'lookup').mockResolvedValue(response)

        const fragment = await (FourByteAnalyzer as any).search4bytes('a9059cbb', buildCallParams())

        expect(lookupSpy).toHaveBeenCalledWith('a9059cbb')
        expect(fragment?.format('sighash')).toBe('transfer(address,uint256)')
    })
})
