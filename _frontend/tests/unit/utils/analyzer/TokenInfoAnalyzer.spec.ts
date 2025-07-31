// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, test} from 'vitest'

// import {describe, expect, test} from 'vitest'
// import {ref} from "vue";
// import {flushPromises} from "@vue/test-utils";
// import MockAdapter from "axios-mock-adapter";
// import axios from "axios";
// import {TokenAssociationStatus, TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";
// import {SAMPLE_ACCOUNT, SAMPLE_ASSOCIATED_TOKEN} from "../../Mocks";
// import {WalletDriver_Mock} from "../../staking/WalletDriver_Mock";
// import {walletManager} from "@/router";
// import {TokenInfo} from "@/schemas/MirrorNodeSchemas";
// import {NetworkConfig} from "@/config/NetworkConfig";

describe.skip("TokenInfoAnalyzer.spec.ts", () => {

    test("basic flow", async () => {

        // // Mock wallet
        // const walletAccountId = SAMPLE_ACCOUNT.account
        // const walletTransactionId = "0.0.29624024-1646025139-152901498"
        // const testDriver = new WalletDriver_Mock(SAMPLE_ACCOUNT, walletTransactionId)
        // walletManager.getDrivers().push(testDriver)
        // walletManager.setActiveDriver(testDriver)
        // expect(walletManager.accountId.value).toBe(null) // because not connected
        //
        // // Mock axios
        // const mock = new MockAdapter(axios as any)
        // const matcher1 = "api/v1/accounts/" + walletAccountId + "/tokens?token.id=" + SAMPLE_ASSOCIATED_TOKEN.token_id + "&limit=1"
        // const response1 = {
        //     "tokens": [SAMPLE_ASSOCIATED_TOKEN],
        //     "links": {
        //         next: null
        //     }
        // }
        // mock.onGet(matcher1).reply(200, response1)
        //
        // // 1) new
        // const tokenInfo = ref<TokenInfo | null>(null)
        // const analyzer = new TokenInfoAnalyzer(tokenInfo, NetworkConfig.FALLBACK)
        // expect(analyzer.tokenId.value).toBeNull()
        // expect(analyzer.ethereumAddress.value).toBeNull()
        // expect(analyzer.tokenSymbol.value).toBe("?")
        // expect(analyzer.decimals.value).toBeNull()
        // expect(analyzer.isFungible.value).toBeNull()
        // expect(analyzer.isNft.value).toBeNull()
        // expect(analyzer.hasFixedFees.value).toBeUndefined()
        // expect(analyzer.hasFractionalFees.value).toBeUndefined()
        // expect(analyzer.hasCustomFees.value).toBeUndefined()
        // expect(analyzer.fixedFees.value).toBeUndefined()
        // expect(analyzer.fractionalFees.value).toBeUndefined()
        // expect(analyzer.royaltyFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.associationStatus.value).toBe(TokenAssociationStatus.Unknown)
        //
        // // 2) mount
        // analyzer.mount()
        // await flushPromises()
        // expect(analyzer.tokenId.value).toBeNull()
        // expect(analyzer.ethereumAddress.value).toBeNull()
        // expect(analyzer.tokenSymbol.value).toBe("?")
        // expect(analyzer.decimals.value).toBeNull()
        // expect(analyzer.isFungible.value).toBeNull()
        // expect(analyzer.isNft.value).toBeNull()
        // expect(analyzer.hasFixedFees.value).toBeUndefined()
        // expect(analyzer.hasFractionalFees.value).toBeUndefined()
        // expect(analyzer.hasCustomFees.value).toBeUndefined()
        // expect(analyzer.fixedFees.value).toBeUndefined()
        // expect(analyzer.fractionalFees.value).toBeUndefined()
        // expect(analyzer.royaltyFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.associationStatus.value).toBe(TokenAssociationStatus.Unknown)
        //
        // // 3) Setup token info
        // tokenInfo.value = SAMPLE_ASSOCIATED_TOKEN
        // expect(analyzer.tokenId.value).toBe(SAMPLE_ASSOCIATED_TOKEN.token_id)
        // expect(analyzer.ethereumAddress.value).toBe("0x00000000000000000000000000000000020bddc8")
        // expect(analyzer.tokenSymbol.value).toBe("HSuite")
        // expect(analyzer.decimals.value).toBe("4")
        // expect(analyzer.isFungible.value).toBe(true)
        // expect(analyzer.isNft.value).toBe(false)
        // expect(analyzer.hasFixedFees.value).toBe(false)
        // expect(analyzer.hasFractionalFees.value).toBe(false)
        // expect(analyzer.hasCustomFees.value).toBeUndefined()
        // expect(analyzer.fixedFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees.fixed_fees)
        // expect(analyzer.fractionalFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees.fractional_fees)
        // expect(analyzer.royaltyFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees)
        // expect(analyzer.tokenChecksum.value).toBe("vnoku")
        // expect(analyzer.associationStatus.value).toBe(TokenAssociationStatus.Unknown)
        //
        // // 4) Connect wallet => walletManager.accountId becomes not null
        // await walletManager.connect()
        // await flushPromises()
        // expect(walletManager.accountId.value).toBe(walletAccountId)
        // expect(analyzer.ethereumAddress.value).toBe("0x00000000000000000000000000000000020bddc8")
        // expect(analyzer.tokenSymbol.value).toBe(SAMPLE_ASSOCIATED_TOKEN.symbol)
        // expect(analyzer.decimals.value).toBe("4")
        // expect(analyzer.isFungible.value).toBe(true)
        // expect(analyzer.isNft.value).toBe(false)
        // expect(analyzer.hasFixedFees.value).toBe(false)
        // expect(analyzer.hasFractionalFees.value).toBe(false)
        // expect(analyzer.hasCustomFees.value).toBeUndefined()
        // expect(analyzer.fixedFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees.fixed_fees)
        // expect(analyzer.fractionalFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees.fractional_fees)
        // expect(analyzer.royaltyFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees)
        // expect(analyzer.tokenChecksum.value).toBe("vnoku")
        // expect(analyzer.associationStatus.value).toBe(TokenAssociationStatus.Associated)
        //
        // // 5) Disconnect wallet => walletManager.accountId becomes null
        // await walletManager.disconnect()
        // await flushPromises()
        // expect(walletManager.accountId.value).toBeNull()
        // expect(analyzer.ethereumAddress.value).toBe("0x00000000000000000000000000000000020bddc8")
        // expect(analyzer.tokenSymbol.value).toBe(SAMPLE_ASSOCIATED_TOKEN.symbol)
        // expect(analyzer.decimals.value).toBe("4")
        // expect(analyzer.isFungible.value).toBe(true)
        // expect(analyzer.isNft.value).toBe(false)
        // expect(analyzer.hasFixedFees.value).toBe(false)
        // expect(analyzer.hasFractionalFees.value).toBe(false)
        // expect(analyzer.hasCustomFees.value).toBeUndefined()
        // expect(analyzer.fixedFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees.fixed_fees)
        // expect(analyzer.fractionalFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees.fractional_fees)
        // expect(analyzer.royaltyFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toStrictEqual(SAMPLE_ASSOCIATED_TOKEN.custom_fees)
        // expect(analyzer.tokenChecksum.value).toBe("vnoku")
        // expect(analyzer.associationStatus.value).toBe(TokenAssociationStatus.Unknown)
        //
        // // 6) Unset token info
        // tokenInfo.value = null
        // expect(analyzer.tokenId.value).toBeNull()
        // expect(analyzer.ethereumAddress.value).toBeNull()
        // expect(analyzer.tokenSymbol.value).toBe("?")
        // expect(analyzer.decimals.value).toBeNull()
        // expect(analyzer.isFungible.value).toBeNull()
        // expect(analyzer.isNft.value).toBeNull()
        // expect(analyzer.hasFixedFees.value).toBeUndefined()
        // expect(analyzer.hasFractionalFees.value).toBeUndefined()
        // expect(analyzer.hasCustomFees.value).toBeUndefined()
        // expect(analyzer.fixedFees.value).toBeUndefined()
        // expect(analyzer.fractionalFees.value).toBeUndefined()
        // expect(analyzer.royaltyFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.associationStatus.value).toBe(TokenAssociationStatus.Unknown)
        //
        // // 7) Unmount
        // analyzer.mount()
        // await flushPromises()
        // expect(analyzer.tokenId.value).toBeNull()
        // expect(analyzer.ethereumAddress.value).toBeNull()
        // expect(analyzer.tokenSymbol.value).toBe("?")
        // expect(analyzer.decimals.value).toBeNull()
        // expect(analyzer.isFungible.value).toBeNull()
        // expect(analyzer.isNft.value).toBeNull()
        // expect(analyzer.hasFixedFees.value).toBeUndefined()
        // expect(analyzer.hasFractionalFees.value).toBeUndefined()
        // expect(analyzer.hasCustomFees.value).toBeUndefined()
        // expect(analyzer.fixedFees.value).toBeUndefined()
        // expect(analyzer.fractionalFees.value).toBeUndefined()
        // expect(analyzer.royaltyFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.customFees.value).toBeUndefined()
        // expect(analyzer.associationStatus.value).toBe(TokenAssociationStatus.Unknown)

    })

})
