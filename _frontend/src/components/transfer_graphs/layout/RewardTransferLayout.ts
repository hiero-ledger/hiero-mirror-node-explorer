// SPDX-License-Identifier: Apache-2.0

import {compareTransferByAccount, StakingRewardTransfer, Transaction,} from "@/schemas/MirrorNodeSchemas";

export class RewardTransferLayout {

    public readonly transaction: Transaction | undefined
    public readonly destinations = Array<StakingRewardTransfer>()
    public readonly rewardAmount: number

    //
    // Public
    //

    public constructor(transaction: Transaction | undefined) {

        this.transaction = transaction
        this.rewardAmount = 0

        if (this.transaction?.staking_reward_transfers) {
            for (const t of this.transaction.staking_reward_transfers) {
                this.destinations.push(t)
                this.rewardAmount += t.amount
            }
            this.destinations.sort(compareTransferByAccount)
        }
    }
}
