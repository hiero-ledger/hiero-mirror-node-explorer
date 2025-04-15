// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios from "axios";
import AccountDetails from "@/pages/AccountDetails.vue";
import {
    SAMPLE_ACCOUNT,
    SAMPLE_ACCOUNT_BALANCES,
    SAMPLE_ACCOUNT_DELETED,
    SAMPLE_ACCOUNT_DUDE,
    SAMPLE_ACCOUNT_HBAR_BALANCE,
    SAMPLE_ACCOUNT_STAKING_ACCOUNT,
    SAMPLE_ACCOUNT_STAKING_NODE,
    SAMPLE_FAILED_TRANSACTION,
    SAMPLE_FAILED_TRANSACTIONS,
    SAMPLE_NETWORK_EXCHANGERATE,
    SAMPLE_NETWORK_NODES,
    SAMPLE_NODE_ACCOUNT,
    SAMPLE_NONFUNGIBLE,
    SAMPLE_TOKEN,
    SAMPLE_TOKEN_DUDE,
    SAMPLE_TRANSACTION,
    SAMPLE_TRANSACTIONS,
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import TransactionTable from "@/components/transaction/TransactionTable.vue";
import {HMSF} from "@/utils/HMSF";
import NotificationBanner from "@/components/NotificationBanner.vue";
import {TransactionID} from "@/utils/TransactionID";
import TransactionFilterSelect from "@/components/transaction/TransactionFilterSelect.vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {networkConfigKey} from "@/AppKeys.ts";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("AccountDetails.vue", () => {

    it("Should display account details", async () => {
        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS);

        const token = SAMPLE_TOKEN
        const matcher3 = "/api/v1/tokens/" + token.token_id
        mock.onGet(matcher3).reply(200, token);

        const nft = SAMPLE_NONFUNGIBLE
        const matcher4 = "/api/v1/tokens/" + nft.token_id
        mock.onGet(matcher4).reply(200, nft);

        const matcher5 = "/api/v1/balances"
        mock.onGet(matcher5).reply(200, SAMPLE_ACCOUNT_BALANCES);

        const matcher6 = "/api/v1/network/exchangerate"
        mock.onGet(matcher6).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const matcher7 = "/api/v1/transactions?timestamp=" + SAMPLE_ACCOUNT.created_timestamp
        mock.onGet(matcher7).reply(200, SAMPLE_TRANSACTIONS);

        const matcher8 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/rewards"
        mock.onGet(matcher8).reply(200, {rewards: []})

        const matcher9 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/crypto"
        mock.onGet(matcher9).reply(200, {rewards: []})

        const matcher10 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/tokens"
        mock.onGet(matcher10).reply(200, {rewards: []})

        const matcher11 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/nfts"
        mock.onGet(matcher11).reply(200, {nfts: []})

        const matcher12 = "api/v1/tokens"
        mock.onGet(matcher12).reply(200, {tokens: []});

        const matcher13 = "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts"
        mock.onGet(matcher13).reply(200, {nfts: []});

        const matcher14 = "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending"
        mock.onGet(matcher14).reply(200, {airdrops: []});

        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                accountId: SAMPLE_ACCOUNT.account ?? undefined
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account,
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/rewards?limit=1",
            "api/v1/balances",
            "api/v1/contracts/" + SAMPLE_ACCOUNT.account,
            "api/v1/transactions",
            "api/v1/transactions",
            "api/v1/contracts/" + SAMPLE_ACCOUNT.evm_address,
            "api/v1/tokens/" + SAMPLE_ACCOUNT.account,
            "api/v1/network/exchangerate",
            "api/v1/blocks",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/nfts",
        ])

        expect(wrapper.text()).toMatch("Account  Account ID " + SAMPLE_ACCOUNT.account)
        expect(wrapper.get("#balanceValue").text()).toContain("23.42647909ℏ$5.76369")
        expect(wrapper.get("#keyValue").text()).toBe(
            "0xaa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbfCopyED25519")

        expect(wrapper.get("#memoValue").text()).toBe("None")
        expect(wrapper.get("#createTransactionValue").text()).toBe(TransactionID.normalizeForDisplay(SAMPLE_TRANSACTION.transaction_id))

        expect(wrapper.get("#expiresAtValue").text()).toBe("None")
        expect(wrapper.get("#autoRenewPeriodValue").text()).toBe("90 days")
        expect(wrapper.get("#maxAutoAssociationValue").text()).toBe("No Auto Association")
        expect(wrapper.get("#receiverSigRequiredValue").text()).toBe("false")

        expect(wrapper.get("#evmAddress").text()).toBe(
            "EVM Address 0x00000000000000000000000000000000000b2607Copy")
        expect(wrapper.get("#ethereumNonceValue").text()).toBe("0")

        expect(wrapper.get("#stakedToName").text()).toBe("Staked to")
        expect(wrapper.get("#stakedToValue").text()).toBe("None")

        const select = wrapper.findComponent(TransactionFilterSelect)
        expect(select.exists()).toBe(true)
        expect(select.text()).toBe(
            "TYPES: ALLADD LIVE HASHAPPROVE ALLOWANCEATOMIC BATCHCANCEL AIRDROPCLAIM AIRDROPCONTRACT CALLCONTRACT " +
            "CREATECONTRACT DELETECONTRACT UPDATECREATE ACCOUNTCREATE TOPICCRYPTO TRANSFERDELETE ACCOUNT" +
            "DELETE ALLOWANCEDELETE LIVE HASHDELETE TOPICETHEREUM TRANSACTIONFILE APPENDFILE CREATEFILE DELETEFILE " +
            "UPDATEFREEZENODE CREATENODE DELETENODE STAKE UPDATENODE UPDATEPSEUDORANDOM NUMBER GENERATESCHEDULE " +
            "CREATESCHEDULE DELETESCHEDULE SIGNSUBMIT MESSAGESYSTEM DELETESYSTEM UNDELETETOKEN AIRDROP" +
            "TOKEN ASSOCIATETOKEN BURNTOKEN CREATETOKEN DELETETOKEN DISSOCIATETOKEN FEE SCHEDULE UPDATE" +
            "TOKEN FREEZETOKEN KYC GRANTTOKEN KYC REVOKETOKEN MINTTOKEN PAUSETOKEN REJECTTOKEN UNFREEZE" +
            "TOKEN UNPAUSETOKEN UPDATETOKEN WIPEUNCHECKED SUBMITUPDATE ACCOUNTUPDATE NFTSUPDATE TOPIC")

        expect(wrapper.find("#recentTransactions").exists()).toBe(true)
        expect(wrapper.findComponent(TransactionTable).exists()).toBe(true)

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display a node account details", async () => {
        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const accountId = SAMPLE_NODE_ACCOUNT.account
        const nodeId = 0

        const matcher1 = "api/v1/accounts/" + accountId
        mock.onGet(matcher1).reply(200, SAMPLE_NODE_ACCOUNT);

        const matcher2 = "api/v1/network/nodes"
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_NODES);

        mock.onGet("/api/v1/transactions").reply(200, []);

        mock.onGet("api/v1/tokens").reply(200, []);

        const matcher8 = "api/v1/accounts/" + accountId + "/nfts"
        mock.onGet(matcher8).reply(200, {nfts: []});

        const matcher9 = "/api/v1/accounts/" + accountId + "/allowances/crypto"
        mock.onGet(matcher9).reply(200, {allowances: []})

        const matcher10 = "/api/v1/accounts/" + accountId + "/allowances/tokens"
        mock.onGet(matcher10).reply(200, {allowances: []})

        const matcher11 = "/api/v1/accounts/" + accountId + "/allowances/nfts"
        mock.onGet(matcher11).reply(200, {allowances: []})

        const matcher14 = "api/v1/accounts/" + accountId + "/airdrops/pending"
        mock.onGet(matcher14).reply(200, {airdrops: []});

        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                accountId: SAMPLE_NODE_ACCOUNT.account ?? undefined
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + accountId,
            "api/v1/network/nodes",
            "api/v1/accounts/0.0.3/rewards?limit=1",
            "api/v1/balances",
            "api/v1/contracts/" + accountId,
            "api/v1/transactions",
            "api/v1/network/exchangerate",
            "api/v1/transactions",
            "api/v1/accounts/" + accountId + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + accountId + "/airdrops/pending",
            "api/v1/accounts/" + accountId + "/airdrops/pending",
            "api/v1/accounts/" + accountId + "/allowances/crypto",
            "api/v1/accounts/" + accountId + "/allowances/tokens",
            "api/v1/accounts/" + accountId + "/nfts",
            "api/v1/accounts/" + accountId + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + accountId + "/airdrops/pending",
            "api/v1/accounts/" + accountId + "/airdrops/pending",
            "api/v1/accounts/" + accountId + "/allowances/crypto",
            "api/v1/accounts/" + accountId + "/allowances/tokens",
            "api/v1/accounts/" + accountId + "/nfts",
            "api/v1/accounts/" + accountId + "/allowances/nfts",
            "api/v1/accounts/" + accountId + "/allowances/nfts",
        ])

        expect(wrapper.text()).toMatch("Account  Account ID " + accountId)

        expect(wrapper.find("#nodeLinkValue").exists()).toBe(true)
        const link = wrapper.get("#nodeLinkValue")
        expect(link.text()).toBe("0 - Hosted by Hedera | East Coast, USA")
        expect(link.get('a').attributes('href')).toMatch(RegExp("/node/" + nodeId + "$"))

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should update when account id changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const account1 = SAMPLE_ACCOUNT
        let matcher1 = "/api/v1/accounts/" + account1.account
        mock.onGet(matcher1).reply(200, account1);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS);

        const token1 = SAMPLE_TOKEN
        let matcher3 = "/api/v1/tokens/" + token1.token_id
        mock.onGet(matcher3).reply(200, token1);

        const nft = SAMPLE_NONFUNGIBLE
        const matcher4 = "/api/v1/tokens/" + nft.token_id
        mock.onGet(matcher4).reply(200, nft);

        const matcher5 = "/api/v1/balances"
        mock.onGet(matcher5).reply(200, SAMPLE_ACCOUNT_BALANCES);

        let matcher8 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/rewards"
        mock.onGet(matcher8).reply(200, {rewards: []})

        let matcher9 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/crypto"
        mock.onGet(matcher9).reply(200, {rewards: []})

        let matcher10 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/tokens"
        mock.onGet(matcher10).reply(200, {rewards: []})

        let matcher11 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/nfts"
        mock.onGet(matcher11).reply(200, {nfts: []})

        const matcher12 = "api/v1/tokens"
        mock.onGet(matcher12).reply(200, {tokens: []});

        let matcher13 = "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts"
        mock.onGet(matcher13).reply(200, {nfts: []});

        let matcher14 = "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending"
        mock.onGet(matcher14).reply(200, {airdrops: []});

        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                accountId: SAMPLE_ACCOUNT.account ?? undefined
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account,
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/rewards?limit=1",
            "api/v1/balances",
            "api/v1/contracts/" + SAMPLE_ACCOUNT.account,
            "api/v1/transactions",
            "api/v1/transactions",
            "api/v1/contracts/" + SAMPLE_ACCOUNT.evm_address,
            "api/v1/tokens/" + SAMPLE_ACCOUNT.account,
            "api/v1/network/exchangerate",
            "api/v1/blocks",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/allowances/nfts",
        ])

        expect(wrapper.text()).toMatch("Account  Account ID " + SAMPLE_ACCOUNT.account)
        expect(wrapper.get("#keyValue").text()).toBe(
            "0xaa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbfCopyED25519")

        const account2 = SAMPLE_ACCOUNT_DUDE
        matcher1 = "/api/v1/accounts/" + account2.account
        mock.onGet(matcher1).reply(200, account2);

        const token2 = SAMPLE_TOKEN_DUDE
        matcher3 = "/api/v1/tokens/" + token2.token_id
        mock.onGet(matcher3).reply(200, token2);

        matcher8 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/rewards"
        mock.onGet(matcher8).reply(200, {rewards: []})

        matcher9 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/crypto"
        mock.onGet(matcher9).reply(200, {rewards: []})

        matcher10 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/tokens"
        mock.onGet(matcher10).reply(200, {rewards: []})

        matcher11 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/nfts"
        mock.onGet(matcher11).reply(200, {nfts: []})

        matcher13 = "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/nfts"
        mock.onGet(matcher13).reply(200, {nfts: []});

        matcher14 = "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/airdrops/pending"
        mock.onGet(matcher14).reply(200, {airdrops: []});

        mock.resetHistory()

        await wrapper.setProps({
            accountId: SAMPLE_ACCOUNT_DUDE.account ?? undefined
        })
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account,
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/rewards?limit=1",
            "api/v1/balances",
            "api/v1/contracts/" + SAMPLE_ACCOUNT_DUDE.account,
            "api/v1/contracts/0x00000000000000000000000000000000000b2608",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/nfts",
            "api/v1/tokens/" + SAMPLE_ACCOUNT_DUDE.account,
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/nfts",
            "api/v1/transactions",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DUDE.account + "/allowances/nfts",
        ])

        expect(wrapper.text()).toMatch("Account  Account ID " + SAMPLE_ACCOUNT_DUDE.account)
        expect(wrapper.get("#keyValue").text()).toBe(
            "0x38f1ea460e95d97eea13aefac760eaf990154b80a3608ab01d4a264944d68746CopyED25519")
        expect(wrapper.get("#memoValue").text()).toBe("Account Dude Memo in clear")
        expect(wrapper.find("#aliasValue").exists()).toBe(false)
        expect(wrapper.get("#expiresAtValue").text()).toBe("3:33:21.4109 AMApr 11, 2022, UTC")
        expect(wrapper.get("#autoRenewPeriodValue").text()).toBe("77d 3h 40min")
        expect(wrapper.get("#maxAutoAssociationValue").text()).toBe("Unlimited Auto Associations")
        expect(wrapper.get("#receiverSigRequiredValue").text()).toBe("true")

        mock.restore()
        wrapper.unmount()
        await flushPromises()

        expect((wrapper.vm as any).balanceAnalyzer.mounted.value).toBe(false)
    });

    it("Should detect invalid account ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const invalidAccountId = "0.0.0.1000"
        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                accountId: invalidAccountId
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
        ])

        expect(wrapper.get("#notificationBanner").text()).toBe("Invalid account ID, address or alias: " + invalidAccountId)

        wrapper.unmount()
        await flushPromises()
    });

    it("Should display notification of deleted contract", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const deletedAccount = SAMPLE_ACCOUNT_DELETED
        const matcher1 = "/api/v1/accounts/" + deletedAccount.account
        mock.onGet(matcher1).reply(200, deletedAccount);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS);

        const token = SAMPLE_TOKEN
        const matcher3 = "/api/v1/tokens/" + token.token_id
        mock.onGet(matcher3).reply(200, token);

        const nft = SAMPLE_NONFUNGIBLE
        const matcher4 = "/api/v1/tokens/" + nft.token_id
        mock.onGet(matcher4).reply(200, nft);

        const matcher5 = "/api/v1/balances"
        mock.onGet(matcher5).reply(200, SAMPLE_ACCOUNT_BALANCES);

        const matcher8 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/rewards"
        mock.onGet(matcher8).reply(200, {rewards: []})

        const matcher9 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/crypto"
        mock.onGet(matcher9).reply(200, {rewards: []})

        const matcher10 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/tokens"
        mock.onGet(matcher10).reply(200, {rewards: []})

        const matcher11 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/nfts"
        mock.onGet(matcher11).reply(200, {nfts: []})

        const matcher12 = "api/v1/tokens"
        mock.onGet(matcher12).reply(200, {tokens: []});

        const matcher13 = "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/nfts"
        mock.onGet(matcher13).reply(200, {nfts: []});

        const matcher14 = "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/airdrops/pending"
        mock.onGet(matcher14).reply(200, {airdrops: []});

        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                accountId: deletedAccount.account ?? undefined
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account,
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/rewards?limit=1",
            "api/v1/balances",
            "api/v1/contracts/" + SAMPLE_ACCOUNT_DELETED.account,
            "api/v1/transactions",
            "api/v1/contracts/0x00000000000000000000000000000000000b2608",
            "api/v1/tokens/" + SAMPLE_ACCOUNT_DELETED.account,
            "api/v1/network/exchangerate",
            "api/v1/blocks",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/nfts",
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_DELETED.account + "/allowances/nfts",
        ])

        expect(wrapper.text()).toMatch(RegExp("Account DetailsAccount is deleted Account  Account ID " + deletedAccount.account))

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.exists()).toBe(true)
        expect(banner.text()).toBe("Account is deleted")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display account staking to node", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT_STAKING_NODE);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_FAILED_TRANSACTIONS);

        const matcher3 = "/api/v1/network/nodes"
        mock.onGet(matcher3).reply(200, SAMPLE_NETWORK_NODES);

        const matcher4 = "/api/v1/balances"
        mock.onGet(matcher4).reply(200, SAMPLE_ACCOUNT_HBAR_BALANCE);

        const matcher5 = "/api/v1/network/exchangerate"
        mock.onGet(matcher5).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const matcher8 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/rewards"
        mock.onGet(matcher8).reply(200, {rewards: []})

        const matcher9 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/crypto"
        mock.onGet(matcher9).reply(200, {rewards: []})

        const matcher10 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/tokens"
        mock.onGet(matcher10).reply(200, {rewards: []})

        const matcher11 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/nfts"
        mock.onGet(matcher11).reply(200, {nfts: []})

        const matcher12 = "api/v1/tokens"
        mock.onGet(matcher12).reply(200, {tokens: []});

        const matcher13 = "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/nfts"
        mock.onGet(matcher13).reply(200, {nfts: []});

        const matcher14 = "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/airdrops/pending"
        mock.onGet(matcher14).reply(200, {airdrops: []});

        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                accountId: SAMPLE_ACCOUNT_STAKING_NODE.account ?? undefined
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account,
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/rewards?limit=1",
            "api/v1/balances",
            "api/v1/contracts/" + SAMPLE_ACCOUNT_STAKING_NODE.account,
            "api/v1/network/exchangerate",
            "api/v1/transactions",
            "api/v1/contracts/0x00000000000000000000000000000000000b2608",
            "api/v1/tokens/" + SAMPLE_ACCOUNT_STAKING_NODE.account,
            "api/v1/contracts/" + SAMPLE_FAILED_TRANSACTION.entity_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/nfts",
            "api/v1/contracts/results/" + SAMPLE_FAILED_TRANSACTION.transaction_id,
            "api/v1/accounts/",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/nfts",
            "api/v1/blocks",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_NODE.account + "/allowances/nfts",
        ])

        expect(wrapper.get("#stakedToName").text()).toBe("Staked to")
        expect(wrapper.get("#stakedToValue").text()).toBe("Node 1 - Hosted by Hedera | East Coast, USA")
        expect(wrapper.get("#pendingRewardValue").text()).toBe("0.12345678ℏ$0.03037Period Started Nov 11, 2022, 00:00 UTC")
        expect(wrapper.get("#declineRewardValue").text()).toBe("Accepted")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display account staking to account", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const config = [
            {
                "name": "mainnet",
                "displayName": "MAINNET",
                "url": "https://mainnet-public.mirrornode.hedera.com/",
                "ledgerID": "00",
                "enableWallet": true,
                "enableStaking": true,
                "enableExpiry": true,
                "enableMarket": true,
                "sourcifySetup": null
            }
        ]
        const networkConfig = NetworkConfig.parse(config)

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT_STAKING_ACCOUNT);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_FAILED_TRANSACTIONS);

        const matcher3 = "/api/v1/network/nodes"
        mock.onGet(matcher3).reply(200, SAMPLE_NETWORK_NODES);

        const matcher4 = "/api/v1/balances"
        mock.onGet(matcher4).reply(200, SAMPLE_ACCOUNT_HBAR_BALANCE);

        const matcher5 = "/api/v1/network/exchangerate"
        mock.onGet(matcher5).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const matcher8 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/rewards"
        mock.onGet(matcher8).reply(200, {rewards: []})

        const matcher9 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/crypto"
        mock.onGet(matcher9).reply(200, {rewards: []})

        const matcher10 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/tokens"
        mock.onGet(matcher10).reply(200, {rewards: []})

        const matcher11 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/nfts"
        mock.onGet(matcher11).reply(200, {nfts: []})

        const matcher12 = "api/v1/tokens"
        mock.onGet(matcher12).reply(200, {tokens: []});

        const matcher13 = "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/nfts"
        mock.onGet(matcher13).reply(200, {nfts: []});

        const matcher14 = "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/airdrops/pending"
        mock.onGet(matcher14).reply(200, {airdrops: []});

        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {[networkConfigKey]: networkConfig, "isMediumScreen": false}
            },
            props: {
                accountId: SAMPLE_ACCOUNT_STAKING_NODE.account ?? undefined
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account,
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/rewards?limit=1",
            "api/v1/balances",
            "api/v1/contracts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account,
            "api/v1/contracts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.staked_account_id,
            "api/v1/network/exchangerate",
            "api/v1/transactions",
            "api/v1/contracts/0x00000000000000000000000000000000000b2608",
            "api/v1/tokens/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account,
            "api/v1/contracts/" + SAMPLE_FAILED_TRANSACTION.entity_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/nfts",
            "api/v1/contracts/results/" + SAMPLE_FAILED_TRANSACTION.transaction_id,
            "api/v1/accounts/",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/crypto",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/nfts",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/nfts",
            "api/v1/blocks",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_STAKING_ACCOUNT.account + "/allowances/nfts",
        ])

        expect(wrapper.get("#stakedToName").text()).toBe("Staked to")
        expect(wrapper.get("#stakedToValue").text()).toBe("Account 0.0.5Hosted by Hedera | Central, USA")
        expect(wrapper.get("#pendingRewardValue").text()).toBe("0.00000000ℏ$0.00000")
        expect(wrapper.find("#declineRewardValue").exists()).toBe(false)

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });
});
