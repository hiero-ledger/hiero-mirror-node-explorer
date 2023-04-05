// noinspection DuplicatedCode

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

import {Ref, ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import {SAMPLE_ACCOUNT} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import {AccountAlias} from "@/utils/AccountAlias";
import {makeEthAddressForAccount} from "@/schemas/HederaUtils";
import {AccountInfo} from "@/schemas/HederaSchemas";
import {CacheUtils} from "@/utils/cache/CacheUtils";

describe("AccountLocParser.ts", () => {

    const SAMPLE_ACCOUNT_ALIAS_HEX = AccountAlias.parse(SAMPLE_ACCOUNT.alias)!.toHexString()
    const SAMPLE_ACCOUNT_ADDRESS = makeEthAddressForAccount(SAMPLE_ACCOUNT as AccountInfo)
    const SAMPLE_ACCOUNT_CHECKSUM = "irkir"

    beforeEach(() => CacheUtils.clearAll())

    //
    // mount + set/unset account loc + unmount
    //

    test("mount + set/unset account loc + unmount", async () => {

        const mock = new MockAdapter(axios)

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        accountLoc.value = SAMPLE_ACCOUNT.account
        await flushPromises()
        expect(parser.accountLoc.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountInfo.value).toStrictEqual(SAMPLE_ACCOUNT)
        expect(parser.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountChecksum.value).toBe(SAMPLE_ACCOUNT_CHECKSUM)
        expect(parser.balance.value).toBe(SAMPLE_ACCOUNT.balance.balance)
        expect(parser.createdTimestamp.value).toBe(SAMPLE_ACCOUNT.created_timestamp)
        expect(parser.key.value).toStrictEqual(SAMPLE_ACCOUNT.key)
        expect(parser.tokens.value).toStrictEqual(SAMPLE_ACCOUNT.balance.tokens)
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBe(SAMPLE_ACCOUNT_ADDRESS)
        expect(parser.aliasByteString.value).toBe(SAMPLE_ACCOUNT_ALIAS_HEX)
        expect(parser.errorNotification.value).toBeNull()

        // 3) Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc + mount + unmount + unset account loc
    //

    test("set account loc + mount + unmount + unset account loc", async () => {

        const mock = new MockAdapter(axios)

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        accountLoc.value = SAMPLE_ACCOUNT.account
        await flushPromises()
        expect(parser.accountLoc.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountInfo.value).toStrictEqual(SAMPLE_ACCOUNT)
        expect(parser.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountChecksum.value).toBe(SAMPLE_ACCOUNT_CHECKSUM)
        expect(parser.balance.value).toBe(SAMPLE_ACCOUNT.balance.balance)
        expect(parser.createdTimestamp.value).toBe(SAMPLE_ACCOUNT.created_timestamp)
        expect(parser.key.value).toStrictEqual(SAMPLE_ACCOUNT.key)
        expect(parser.tokens.value).toStrictEqual(SAMPLE_ACCOUNT.balance.tokens)
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBe(SAMPLE_ACCOUNT_ADDRESS)
        expect(parser.aliasByteString.value).toBe(SAMPLE_ACCOUNT_ALIAS_HEX)
        expect(parser.errorNotification.value).toBeNull()

        // 3) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc with account address
    //

    test("set account loc with account address", async () => {

        const mock = new MockAdapter(axios)

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_ADDRESS
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account address
        accountLoc.value = SAMPLE_ACCOUNT_ADDRESS
        await flushPromises()
        expect(parser.accountLoc.value).toBe(SAMPLE_ACCOUNT_ADDRESS)
        expect(parser.accountInfo.value).toStrictEqual(SAMPLE_ACCOUNT)
        expect(parser.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountChecksum.value).toBe(SAMPLE_ACCOUNT_CHECKSUM)
        expect(parser.balance.value).toBe(SAMPLE_ACCOUNT.balance.balance)
        expect(parser.createdTimestamp.value).toBe(SAMPLE_ACCOUNT.created_timestamp)
        expect(parser.key.value).toStrictEqual(SAMPLE_ACCOUNT.key)
        expect(parser.tokens.value).toStrictEqual(SAMPLE_ACCOUNT.balance.tokens)
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBe(SAMPLE_ACCOUNT_ADDRESS)
        expect(parser.aliasByteString.value).toBe(SAMPLE_ACCOUNT_ALIAS_HEX)
        expect(parser.errorNotification.value).toBeNull()

        // 3) Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc with account alias in base 32
    //

    test("set account loc with account alias in base 32", async () => {

        const mock = new MockAdapter(axios)

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.alias
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account alias
        accountLoc.value = SAMPLE_ACCOUNT.alias
        await flushPromises()
        expect(parser.accountLoc.value).toBe(SAMPLE_ACCOUNT.alias)
        expect(parser.accountInfo.value).toStrictEqual(SAMPLE_ACCOUNT)
        expect(parser.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountChecksum.value).toBe(SAMPLE_ACCOUNT_CHECKSUM)
        expect(parser.balance.value).toBe(SAMPLE_ACCOUNT.balance.balance)
        expect(parser.createdTimestamp.value).toBe(SAMPLE_ACCOUNT.created_timestamp)
        expect(parser.key.value).toStrictEqual(SAMPLE_ACCOUNT.key)
        expect(parser.tokens.value).toStrictEqual(SAMPLE_ACCOUNT.balance.tokens)
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBe(SAMPLE_ACCOUNT_ADDRESS)
        expect(parser.aliasByteString.value).toBe(SAMPLE_ACCOUNT_ALIAS_HEX)
        expect(parser.errorNotification.value).toBeNull()

        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc with account alias in hex form
    //

    test("set account loc with account alias in hex form", async () => {

        const mock = new MockAdapter(axios)

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.alias
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account alias in hex form
        accountLoc.value = SAMPLE_ACCOUNT_ALIAS_HEX
        await flushPromises()
        expect(parser.accountLoc.value).toBe(SAMPLE_ACCOUNT_ALIAS_HEX)
        expect(parser.accountInfo.value).toStrictEqual(SAMPLE_ACCOUNT)
        expect(parser.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(parser.accountChecksum.value).toBe(SAMPLE_ACCOUNT_CHECKSUM)
        expect(parser.balance.value).toBe(SAMPLE_ACCOUNT.balance.balance)
        expect(parser.createdTimestamp.value).toBe(SAMPLE_ACCOUNT.created_timestamp)
        expect(parser.key.value).toStrictEqual(SAMPLE_ACCOUNT.key)
        expect(parser.tokens.value).toStrictEqual(SAMPLE_ACCOUNT.balance.tokens)
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBe(SAMPLE_ACCOUNT_ADDRESS)
        expect(parser.aliasByteString.value).toBe(SAMPLE_ACCOUNT_ALIAS_HEX)
        expect(parser.errorNotification.value).toBeNull()

        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc with unknown account id
    //

    test("set account loc with unknown account id", async () => {

        const mock = new MockAdapter(axios)

        const UNKNOWN_ACCOUNT_ID = "0.0.42"
        const matcher1 = "/api/v1/accounts/" + UNKNOWN_ACCOUNT_ID
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        accountLoc.value = UNKNOWN_ACCOUNT_ID
        await flushPromises()
        expect(parser.accountLoc.value).toBe(UNKNOWN_ACCOUNT_ID)
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Account with ID 0.0.42 was not found")

        // 3) Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc with unknown account address
    //

    test("set account loc with unknown account address", async () => {

        const mock = new MockAdapter(axios)

        const UNKNOWN_ACCOUNT_ADDRESS = "0x0001020304050607080900010203040506070809"
        const matcher1 = "/api/v1/accounts/" + UNKNOWN_ACCOUNT_ADDRESS
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        accountLoc.value = UNKNOWN_ACCOUNT_ADDRESS
        await flushPromises()
        expect(parser.accountLoc.value).toBe(UNKNOWN_ACCOUNT_ADDRESS)
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Account with Ethereum address 0x0001020304050607080900010203040506070809 was not found")

        // 3) Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc with unknown account alias in base32
    //

    test("set account loc with unknown alias in base32", async () => {

        const mock = new MockAdapter(axios)

        const UNKNOWN_ACCOUNT_ALIAS = SAMPLE_ACCOUNT.alias
        const matcher1 = "/api/v1/accounts/" + UNKNOWN_ACCOUNT_ALIAS
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        accountLoc.value = UNKNOWN_ACCOUNT_ALIAS
        await flushPromises()
        expect(parser.accountLoc.value).toBe(UNKNOWN_ACCOUNT_ALIAS)
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Account with alias CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ was not found")

        // 3) Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

    //
    // set account loc with unknown account alias in hex
    //

    test("set account loc with unknown alias in hex", async () => {

        const mock = new MockAdapter(axios)

        const UNKNOWN_ACCOUNT_ALIAS = SAMPLE_ACCOUNT_ALIAS_HEX
        const matcher1 = "/api/v1/accounts/" + UNKNOWN_ACCOUNT_ALIAS
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        accountLoc.value = UNKNOWN_ACCOUNT_ALIAS
        await flushPromises()
        expect(parser.accountLoc.value).toBe(UNKNOWN_ACCOUNT_ALIAS)
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Account with alias CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ was not found")

        // 3) Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })


    //
    // set account loc with dummy value
    //

    test("set account loc with dummy value", async () => {

        const mock = new MockAdapter(axios)

        const DUMMY_LOC = "dummy loc"
        const matcher1 = "/api/v1/accounts/" + DUMMY_LOC
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const accountLoc: Ref<string|null> = ref(null)
        const parser = new AccountLocParser(accountLoc)
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        accountLoc.value = DUMMY_LOC
        await flushPromises()
        expect(parser.accountLoc.value).toBe(DUMMY_LOC)
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Invalid account ID, address or alias: dummy loc")

        // 3) Unsets
        accountLoc.value = null
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.accountLoc.value).toBeNull()
        expect(parser.accountInfo.value).toBeNull()
        expect(parser.accountId.value).toBeNull()
        expect(parser.accountChecksum.value).toBeNull()
        expect(parser.balance.value).toBeNull()
        expect(parser.createdTimestamp.value).toBeNull()
        expect(parser.key.value).toBeNull()
        expect(parser.tokens.value).toBeNull()
        expect(parser.stakedNodeId.value).toBeNull()
        expect(parser.stakedAccountId.value).toBeNull()
        expect(parser.stakePeriodStart.value).toBeNull()
        expect(parser.pendingReward.value).toBeNull()
        expect(parser.accountDescription.value).toBeNull()
        expect(parser.nodeId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.aliasByteString.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

})
