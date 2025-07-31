// SPDX-License-Identifier: Apache-2.0

// import {WalletDriver_Hiero} from "@/utils/wallet/WalletDriver_Hiero";
// import {AccountAllowanceApproveTransaction, AccountUpdateTransaction} from "@hashgraph/sdk";
// import {AccountBalanceTransactions} from "@/schemas/MirrorNodeSchemas";
// import {Signer} from "@hashgraph/sdk/lib/Signer";
//
// export class WalletDriver_Mock extends WalletDriver_Hiero {
//
//     private static WALLET_NAME = "WalletMock"
//
//     public readonly account: AccountBalanceTransactions
//     public readonly transactionId: string
//
//     public updateAccountCounter = 0
//
//     //
//     // Public
//     //
//
//     public constructor(account: AccountBalanceTransactions, transactionId: string) {
//         super(WalletDriver_Mock.WALLET_NAME, null, null)
//         this.account = account
//         this.transactionId = transactionId
//     }
//
//
//     //
//     // WalletDriver
//     //
//
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     public async connect(network: string): Promise<string[]> {
//         let result: string[]
//         if (!this.connected) {
//             this.connected = true
//             result = [this.account.account!]
//         } else {
//             throw this.connectFailure("bug")
//         }
//         return Promise.resolve(result)
//     }
//
//     public async disconnect(): Promise<void> {
//         if (this.connected) {
//             this.connected = false
//         }
//     }
//
//     //
//     // WalletDriver_Hedera
//     //
//
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     public makeSigner(accountId: string): Signer | null {
//         return null
//     }
//
//     protected async executeTransaction(accountId: string, request: AccountUpdateTransaction | AccountAllowanceApproveTransaction): Promise<string> {
//         let result: string
//
//         this.updateAccountCounter += 1
//         if (this.connected) {
//             if (request instanceof AccountUpdateTransaction) {
//                 if (this.account.account == accountId) {
//                     if (request.stakedNodeId !== null) {
//                         const stakeNodeId = request.stakedNodeId.toNumber()
//                         this.account.staked_node_id = stakeNodeId != -1 ? stakeNodeId : null
//                         this.account.staked_account_id = null
//                         this.account.stake_period_start = "1668124800.000000000"
//                     } else if (request.stakedAccountId !== null) {
//                         const stakedAccountId = request.stakedAccountId.toString()
//                         this.account.staked_node_id = null
//                         this.account.staked_account_id = stakedAccountId != "0.0.0" ? stakedAccountId : null
//                         this.account.stake_period_start = null
//                     }
//                     if (!this.account.staked_node_id && !this.account.staked_account_id) {
//                         this.account.stake_period_start = null
//                     }
//                     if (request.declineStakingRewards !== null) {
//                         this.account.decline_reward = request.declineStakingRewards
//                     }
//                     result = this.transactionId
//                 } else {
//                     throw this.callFailure("Unexpected account id: " + accountId)
//                 }
//             } else {
//                 throw this.callFailure("Unexpected transaction subclass: " + request.constructor.name)
//             }
//         } else {
//             throw this.callFailure("Not connected yet")
//         }
//
//         return Promise.resolve(result)
//     }
//
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     isCancelError(reason: unknown): boolean {
//         return false;
//     }
// }
