// SPDX-License-Identifier: Apache-2.0


import {describe, expect, test} from 'vitest'
import {PathParam} from "@/utils/PathParam";
import {EntityID} from "@/utils/EntityID";
import {AccountAlias} from "@/utils/AccountAlias";
import {EthereumAddress} from "@/utils/EthereumAddress";

describe("PathParam", () => {

    //
    // parseBlockHashOrNumber()
    //

    test("PathParam.parseBlockHashOrNumber() with a hash", () => {

        const sampleHash = "aa1c941f33e06fc8458bf82880527b01473ca7dff9dee0159542c00971038109dbd86515ff4ff1f4d9fd25428d39489b"

        let hon = PathParam.parseBlockLoc(sampleHash)
        expect(hon?.toString()).toBe(sampleHash)

        hon = PathParam.parseBlockLoc("0x" + sampleHash)
        expect(hon?.toString()).toBe(sampleHash)
    })

    test("PathParam.parseBlockHashOrNumber() with a number", () => {

        const sampleNb = "444"
        const hon = PathParam.parseBlockLoc(sampleNb)
        expect(hon?.toString()).toBe(sampleNb)
    })

    test("PathParam.parse() with invalid block number", () => {
        expect(PathParam.parseBlockLoc("-1")).toBeNull()
    })

    test("PathParam.parseBlockHashOrNumber() with invalid block hash", () => {

        const tooShort = "1c941f33e06fc8458bf82880527b01473ca7dff9dee0159542c00971038109dbd86515ff4ff1f4d9fd25428d39489b"

        let hon = PathParam.parseBlockLoc(tooShort)
        expect(hon).toBeNull()

        hon = PathParam.parseBlockLoc("0x" + tooShort)
        expect(hon).toBeNull()

        const tooLong = "aa1c941f33e06fc8458bf82880527b01473ca7dff9dee0159542c00971038109dbd86515ff4ff1f4d9fd25428d39489b00"

        hon = PathParam.parseBlockLoc(tooLong)
        expect(hon).toBeNull()

        hon = PathParam.parseBlockLoc("0x" + tooShort)
        expect(hon).toBeNull()
    })

    //
    // parseAccountLoc()
    //

    test("PathParam.parseAccountLoc() with entity id", () => {

        const accountId = "0.0.1234"

        const pp = PathParam.parseAccountLoc(accountId)
        expect(pp).toBeInstanceOf(EntityID)
        expect(pp!.toString()).toBe(accountId)
    })

    test("PathParam.parseAccountLoc() with alias in base32", () => {

        const alias = "HIQQGOSRIF3EM35ICXWUQH722CIRBIWTIT3MTN4MDUKK7Q2RYOSRXYZ5"

        const pp = PathParam.parseAccountLoc(alias)
        expect(pp).toBeInstanceOf(AccountAlias)
        expect(pp?.toString()).toBe(alias)
    })

    test("PathParam.parseAccountLoc() with alias in hex", () => {

        const alias = "HIQQGOSRIF3EM35ICXWUQH722CIRBIWTIT3MTN4MDUKK7Q2RYOSRXYZ5"
        const aliasInHex = "0x3a21033a514176466fa815ed481ffad09110a2d344f6c9b78c1d14afc351c3a51be33d"

        const pp = PathParam.parseAccountLoc(aliasInHex)
        expect(pp).toBeInstanceOf(AccountAlias)
        expect(pp?.toString()).toBe(alias)
    })

    test("PathParam.parseAccountLoc() with evm address", () => {

        const evmAddress = "a94f5374fce5edbc8e2a8697c15331677e6ebf0b"

        let pp = PathParam.parseAccountLoc(evmAddress)
        expect(pp).toBeInstanceOf(EthereumAddress)
        expect(pp?.toString()).toBe("0x" + evmAddress)
        pp = PathParam.parseAccountLoc("0x" + evmAddress)
        expect(pp).toBeInstanceOf(EthereumAddress)
        expect(pp?.toString()).toBe("0x" + evmAddress)
    })


    //
    // parseAccountIdOrAliasOrEvmAddress()
    //

    test("PathParam.parseAccountIdOrAliasOrEvmAddress() with entity id", () => {

        const accountId = "0.0.1234"

        const pp = PathParam.parseAccountIdOrAliasOrEvmAddress(accountId)
        expect(pp).toBe(accountId)
    })

    test("PathParam.parseAccountIdOrAliasOrEvmAddress() with alias in base32", () => {

        const alias = "HIQQGOSRIF3EM35ICXWUQH722CIRBIWTIT3MTN4MDUKK7Q2RYOSRXYZ5"

        const pp = PathParam.parseAccountIdOrAliasOrEvmAddress(alias)
        expect(pp).toBe(alias)
    })

    test("PathParam.parseAccountIdOrAliasOrEvmAddress() with alias in hex", () => {

        const alias = "HIQQGOSRIF3EM35ICXWUQH722CIRBIWTIT3MTN4MDUKK7Q2RYOSRXYZ5"
        const aliasInHex = "0x3a21033a514176466fa815ed481ffad09110a2d344f6c9b78c1d14afc351c3a51be33d"

        const pp = PathParam.parseAccountIdOrAliasOrEvmAddress(aliasInHex)
        expect(pp).toBe(alias)
    })

    test("PathParam.parseAccountIdOrAliasOrEvmAddress() with evm address", () => {

        const evmAddress = "a94f5374fce5edbc8e2a8697c15331677e6ebf0b"

        let pp = PathParam.parseAccountIdOrAliasOrEvmAddress(evmAddress)
        expect(pp).toBe("0x" + evmAddress)
        pp = PathParam.parseAccountIdOrAliasOrEvmAddress("0x" + evmAddress)
        expect(pp).toBe("0x" + evmAddress)
    })
})
