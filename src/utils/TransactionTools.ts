// SPDX-License-Identifier: Apache-2.0

import {StakingRewardTransfer, Transaction, TransactionType, Transfer} from "@/schemas/MirrorNodeSchemas";
import {TransactionID} from "@/utils/TransactionID";

export function makeSummaryLabel(row: Transaction): string {
    let result: string
    let netAmount: number

    switch (row.name) {
        case TransactionType.CRYPTOTRANSFER:
            netAmount = computeNetAmount(row.transfers, row.charged_tx_fee);
            result = makeTransferLabel(row, netAmount)
            break
        case TransactionType.CONSENSUSCREATETOPIC:
        case TransactionType.CONSENSUSDELETETOPIC:
        case TransactionType.CONSENSUSUPDATETOPIC:
            result = row.entity_id ? "Topic ID: " + row.entity_id : ""
            break
        case TransactionType.CONSENSUSSUBMITMESSAGE:
            result = formatMemo(row.memo_base64 ?? "")
            break
        case TransactionType.CRYPTOCREATEACCOUNT:
        case TransactionType.CRYPTODELETE:
        case TransactionType.CRYPTOUPDATEACCOUNT:
        case TransactionType.TOKENASSOCIATE:
        case TransactionType.TOKENDISSOCIATE:
        case TransactionType.TOKENGRANTKYC:
        case TransactionType.TOKENREVOKEKYC:
        case TransactionType.TOKENFREEZE:
        case TransactionType.TOKENUNFREEZE:
        case TransactionType.TOKENREJECT:
        case TransactionType.CRYPTOADDLIVEHASH:
        case TransactionType.CRYPTODELETELIVEHASH:
            result = row.entity_id ? "Account ID: " + row.entity_id : ""
            break
        case TransactionType.TOKENBURN:
        case TransactionType.TOKENMINT:
        case TransactionType.TOKENCREATION:
        case TransactionType.TOKENDELETION:
        case TransactionType.TOKENFEESCHEDULEUPDATE:
        case TransactionType.TOKENPAUSE:
        case TransactionType.TOKENUNPAUSE:
        case TransactionType.TOKENUPDATE:
        case TransactionType.TOKENUPDATENFTS:
        case TransactionType.TOKENWIPE:
        case TransactionType.TOKENAIRDROP:
        case TransactionType.TOKENCANCELAIRDROP:
        case TransactionType.TOKENCLAIMAIRDROP:
            result = row.entity_id ? "Token ID: " + row.entity_id : ""
            break
        case TransactionType.CONTRACTCREATEINSTANCE:
        case TransactionType.CONTRACTDELETEINSTANCE:
        case TransactionType.CONTRACTUPDATEINSTANCE:
        case TransactionType.CONTRACTCALL:
            result = row.entity_id ? "Contract ID: " + row.entity_id : ""
            break
        case TransactionType.FILECREATE:
        case TransactionType.FILEUPDATE:
        case TransactionType.FILEDELETE:
        case TransactionType.FILEAPPEND:
            result = row.entity_id ? "File ID: " + row.entity_id : ""
            break
        case TransactionType.SCHEDULECREATE:
        case TransactionType.SCHEDULEDELETE:
        case TransactionType.SCHEDULESIGN:
            result = row.entity_id ? "Schedule ID: " + row.entity_id : ""
            break
        case TransactionType.CRYPTOAPPROVEALLOWANCE:
        case TransactionType.CRYPTODELETEALLOWANCE:
            result = formatMemo(row.memo_base64 ?? "")
            break
        default:
            result = ""
            break
    }
    return result
}

function makeTransferLabel(row: Transaction, netAmount: number): string {
    const TREASURY = "0.0.98"
    let result: string
    let fromAccount = null
    let toAccount = null
    let foundTreasury = false
    let nbFrom = 0

    if (netAmount > 0 && row.transfers !== undefined) {
        for (const t of row.transfers) {
            if (t.amount < 0) {
                fromAccount = t.account
                nbFrom++
                if (Math.abs(t.amount) == netAmount) {
                    break
                }
            }
        }
        for (const t of row.transfers) {
            if (t.amount > 0) {
                if (t.amount == netAmount) {
                    toAccount = t.account
                    break
                } else if (t.account == TREASURY) {
                    foundTreasury = true
                }
            }
        }

        if (fromAccount && toAccount) {
            result = fromAccount + " \u2192 " + toAccount
        } else if (nbFrom == 1 && foundTreasury) {
            result = fromAccount + " \u2192 " + TREASURY
        } else {
            result = ""
        }
    } else {
        result = ""
    }

    return result
}

export function makeTypeLabel(type: TransactionType | undefined): string {
    let result: string
    switch (type) {

        case TransactionType.CONSENSUSCREATETOPIC:
            result = "Create Topic";
            break;
        case TransactionType.CONSENSUSUPDATETOPIC:
            result = "Update Topic";
            break;
        case TransactionType.CONSENSUSDELETETOPIC:
            result = "Delete Topic";
            break;
        case TransactionType.CONSENSUSSUBMITMESSAGE:
            result = "Submit Message"
            break;

        case TransactionType.CONTRACTCALL:
            result = "Contract Call"
            break;
        case TransactionType.CONTRACTDELETEINSTANCE:
            result = "Contract Delete"
            break;
        case TransactionType.CONTRACTCREATEINSTANCE:
            result = "Contract Create"
            break;
        case TransactionType.CONTRACTUPDATEINSTANCE:
            result = "Contract Update"
            break;

        case TransactionType.CRYPTOADDLIVEHASH:
            result = "Add Live Hash"
            break;
        case TransactionType.CRYPTOCREATEACCOUNT:
            result = "Create Account"
            break;
        case TransactionType.CRYPTODELETE:
            result = "Delete Account"
            break;
        case TransactionType.CRYPTOUPDATEACCOUNT:
            result = "Update Account"
            break;
        case TransactionType.CRYPTODELETELIVEHASH:
            result = "Delete Live Hash"
            break
        case TransactionType.CRYPTOTRANSFER:
            result = "Crypto Transfer"
            break
        case TransactionType.CRYPTOAPPROVEALLOWANCE:
            result = "Approve Allowance"
            break
        case TransactionType.CRYPTODELETEALLOWANCE:
            result = "Delete Allowance"
            break

        case TransactionType.ETHEREUMTRANSACTION:
            result = "Ethereum Transaction";
            break;

        case TransactionType.FILECREATE:
            result = "File Create";
            break;
        case TransactionType.FILEDELETE:
            result = "File Delete";
            break;
        case TransactionType.FILEAPPEND:
            result = "File Append";
            break;
        case TransactionType.FILEUPDATE:
            result = "File Update";
            break;

        case TransactionType.FREEZE:
            result = "Freeze";
            break;

        case TransactionType.NODECREATE:
            result = "Node Create";
            break;
        case TransactionType.NODEDELETE:
            result = "Node Delete";
            break;
        case TransactionType.NODESTAKEUPDATE:
            result = "Node Stake Update";
            break;
        case TransactionType.NODEUPDATE:
            result = "Node Update";
            break;

        case TransactionType.SCHEDULECREATE:
            result = "Schedule Create";
            break;
        case TransactionType.SCHEDULEDELETE:
            result = "Schedule Delete";
            break;
        case TransactionType.SCHEDULESIGN:
            result = "Schedule Sign";
            break;

        case TransactionType.SYSTEMDELETE:
            result = "System Delete";
            break;
        case TransactionType.SYSTEMUNDELETE:
            result = "System Undelete";
            break;

        case TransactionType.TOKENBURN:
            result = "Token Burn";
            break;
        case TransactionType.TOKENCREATION:
            result = "Token Create";
            break;
        case TransactionType.TOKENDELETION:
            result = "Token Delete";
            break;
        case TransactionType.TOKENUPDATE:
            result = "Token Update";
            break;
        case TransactionType.TOKENUPDATENFTS:
            result = "Update NFTs";
            break;
        case TransactionType.TOKENASSOCIATE:
            result = "Token Associate";
            break;
        case TransactionType.TOKENDISSOCIATE:
            result = "Token Dissociate";
            break;
        case TransactionType.TOKENFEESCHEDULEUPDATE:
            result = "Token Fee Schedule Update";
            break;
        case TransactionType.TOKENFREEZE:
            result = "Token Freeze";
            break;
        case TransactionType.TOKENGRANTKYC:
            result = "Token KYC Grant";
            break;
        case TransactionType.TOKENMINT:
            result = "Token Mint";
            break;
        case TransactionType.TOKENPAUSE:
            result = "Token Pause";
            break;
        case TransactionType.TOKENREJECT:
            result = "Token Reject";
            break;
        case TransactionType.TOKENAIRDROP:
            result = "Token Airdrop";
            break;
        case TransactionType.TOKENCANCELAIRDROP:
            result = "Cancel Airdrop";
            break;
        case TransactionType.TOKENCLAIMAIRDROP:
            result = "Claim Airdrop";
            break;
        case TransactionType.TOKENREVOKEKYC:
            result = "Token KYC Revoke";
            break;
        case TransactionType.TOKENUNFREEZE:
            result = "Token Unfreeze";
            break;
        case TransactionType.TOKENUNPAUSE:
            result = "Token Unpause";
            break;
        case TransactionType.TOKENWIPE:
            result = "Token Wipe";
            break;

        case TransactionType.UNCHECKEDSUBMIT:
            result = "Unchecked Submit";
            break;

        case TransactionType.UTILPRNG:
            result = "Pseudorandom Number Generate";
            break;

        default:
            result = type ?? "?"
            break
    }

    return result.toUpperCase()
}

export function makeOperatorAccountLabel(transaction: Transaction): string {
    let result: string
    const transactionId = transaction.transaction_id;
    if (transactionId != null) {
        result = TransactionID.makePayerID(transactionId) ?? "?"
    } else {
        result = "?"
    }
    return result
}

export function isSuccessfulResult(transactionResult: string): boolean {
    return transactionResult === "SUCCESS"
        || transactionResult === "FEE_SCHEDULE_FILE_PART_UPLOADED"
        || transactionResult === "SUCCESS_BUT_MISSING_EXPECTED_OPERATION"
}

function formatMemo(memo64: string): string {
    let result: string
    try {
        result = atob(memo64)
    } catch {
        result = memo64
    }
    return result
}

export function computeNetAmount(transfers: Transfer[] | undefined, transactionFee: number | undefined): number {
    let result = 0
    if (transfers !== undefined) {
        for (const t of transfers) {
            if (t.amount > 0) {
                result += t.amount
            }
        }
    }
    result -= transactionFee ?? 0
    return result
}

export function makeNetOfRewards(transfers: Transfer[] | undefined, rewards: StakingRewardTransfer[] | undefined): Transfer[] {
    let result = Array<Transfer>()
    let totalRewardAmount = 0

    if (transfers && rewards && transfers.length > 0 && rewards.length > 0) {
        for (const r of rewards) {
            totalRewardAmount += r.amount
        }
        let netAmount: number
        for (const t of transfers) {
            if (t.account === "0.0.800") {
                netAmount = t.amount + totalRewardAmount
            } else {
                netAmount = t.amount
                for (const r of rewards) {
                    if (t.account == r.account) {
                        netAmount = t.amount - r.amount
                        break
                    }
                }
            }
            result.push({
                amount: netAmount,
                account: t.account,
                is_approval: t.is_approval
            })
        }
    } else {
        result = transfers ?? []
    }

    return result
}

export function getTargetedTokens(transaction: Transaction, nbItems: number | null = null): string[] {
    let result: string[]
    const type = transaction.name
    if (makeTypeLabel(type).toUpperCase().includes("TOKEN")) {
        result = transaction.entity_id ? [transaction.entity_id] : []
    } else if (type === TransactionType.CRYPTOTRANSFER) {
        result = []
        transaction.nft_transfers.forEach((nft) => {
            if (nft.token_id && !result.includes(nft.token_id)) {
                result.push(nft.token_id)
            }
        })
        transaction.token_transfers.forEach((token) => {
            if (token.token_id && !result.includes(token.token_id)) {
                result.push(token.token_id)
            }
        })
    } else {
        result = []
    }
    if (nbItems != null) {
        result = result.slice(0, nbItems)
    }
    return result
}

