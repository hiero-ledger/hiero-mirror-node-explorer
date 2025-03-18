// SPDX-License-Identifier: Apache-2.0

import {
    AccountInfo,
    AccountsResponse,
    Block,
    ContractLog,
    ContractResult,
    ContractResultsLogResponse,
    ContractResultsResponse,
    HTS_PRECOMPILE_CONTRACT_ID,
    KeyType,
    NetworkFeesResponse,
    NetworkNode,
    Nft,
    NftTransfer,
    REDIRECT_FOR_TOKEN_FUNCTION_SIGHASH,
    Token,
    TokenInfo,
    TokenRelationshipResponse,
    TokenTransfer,
    Transaction,
    TransactionByIdResponse,
    TransactionResponse,
    TransactionType,
    Transfer,
} from "@/schemas/MirrorNodeSchemas";
import {ethers} from "ethers";
import {EntityID} from "@/utils/EntityID";
import * as hashgraph from "@hashgraph/proto";
import axios from "axios";
import {waitFor} from "@/utils/TimerUtils";
import {TransactionID} from "@/utils/TransactionID.ts";
import {Timestamp} from "@/utils/Timestamp.ts";

export function makeEthAddressForAccount(account: AccountInfo): string | null {
    if (account.evm_address) return account.evm_address;
    if (account.key?.key && account.key?._type == KeyType.ECDSA_SECP256K1) {
        // Generates Ethereum address from public key
        return ethers.computeAddress("0x" + account.key.key)
    }
    if (account.account) {
        // Generates Ethereum address from account id
        const entityID = EntityID.parse(account.account)
        return entityID != null ? ('0x' + entityID.toAddress()) : null
    }
    return null;
}

export function makeEthAddressForToken(token: TokenInfo): string | null {
    let result: string | null
    if (token.token_id) {
        const entityID = EntityID.parse(token.token_id)
        result = entityID != null ? ('0x' + entityID.toAddress()) : null
    } else {
        result = null
    }
    return result
}

export function makeTokenName(token: TokenInfo | null, maxLength: number = 40): string {
    let result = token?.name ?? '?'
    if (result.length > maxLength) {
        result = result.slice(0, maxLength) + '…'
    }
    return result
}

export function makeTokenSymbol(token: TokenInfo | null, maxLength: number = 11): string {
    let result = token?.symbol ?? '?'
    if (result.length > maxLength) {
        result = result.slice(0, maxLength) + '…'
    }
    return result
}

export const MAX_TOKEN_SUPPLY = 9223372036854775807n

export function formatTokenAmount(rawAmount: bigint, decimalCount: number): string {
    let result: string
    if (rawAmount > MAX_TOKEN_SUPPLY) {
        rawAmount = MAX_TOKEN_SUPPLY
    }
    const amountFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalCount,
        maximumFractionDigits: decimalCount
    })
    if (decimalCount) {
        result = amountFormatter.format(Number(rawAmount) / Math.pow(10, decimalCount))
    } else {
        result = amountFormatter.format(rawAmount)
    }
    return result
}

export function tokenOrNftId(token: Token | Nft): string {
    const serial = (token as Nft).serial_number
    return token.token_id + (serial != undefined ? ` #${serial.toString()}` : "")
}

export function makeNodeDescription(node: NetworkNode): string {
    let result: string
    if (node.description) {
        result = node.description
    } else {
        result = makeDefaultNodeDescription(node.node_id ?? null)
    }
    return result
}

export function makeNodeDescriptionPrefix(node: NetworkNode): string {
    const description = makeNodeDescription(node)
    let result: string
    if (description.slice(0, 9).toLowerCase() === "hosted by") {
        result = description.slice(0, 9) + " "
    } else if (description.slice(0, 10).toLowerCase() === "hosted for") {
        result = description.slice(0, 10) + " "
    } else {
        result = ""
    }
    return result
}

export function makeNodeOwnerDescription(node: NetworkNode, short = false): string {
    const description = makeNodeDescription(node)
    let result: string
    if (description?.slice(0, 9).toLowerCase() === "hosted by") {
        result = description.slice(10)
    } else if (description.slice(0, 10).toLowerCase() === "hosted for") {
        result = description.slice(11)
    } else {
        result = description
    }
    return short ? result.split('|')[0].trimEnd() : result
}

export function makeDefaultNodeDescription(nodeId: number | null): string {
    return nodeId ? "Node " + nodeId : "?"
}

export function makeOperatorDescription(accountId: string, nodes: NetworkNode[], isFee = false): string | null {
    let result: string | null
    if (accountId === "0.0.98") {
        result = "Hedera fee collection account"
    } else if (accountId === "0.0.800") {
        result = isFee ? "Staking reward account fee" : "Staking reward account"
    } else if (accountId === "0.0.801") {
        result = isFee ? "Node reward account fee" : "Node reward account"
    } else {
        const node = lookupNodeByAccountId(accountId, nodes)
        result = node !== null
            ? isFee ? `Node fee (${makeNodeOwnerDescription(node, true)})` : makeNodeDescription(node)
            : null
    }
    return result
}

export function isFeeTransfer(t: Transfer, nodes: NetworkNode[]): boolean {
    return t.account !== null
        && t.amount > 0
        && makeOperatorDescription(t.account, nodes) !== null
}

const errorStringSelector = '0x08c379a0'
const panicUint256Selector = '0x4e487b71'

export function decodeSolidityErrorMessage(message: string | null): string | null {
    let result: string | null

    // https://blog.soliditylang.org/2020/12/16/solidity-v0.8.0-release-announcement/
    // Section "Revert on assertion failures and similar conditions instead of using the invalid opcode"

    try {
        if (message === null) {
            result = null
        } else if (message.startsWith(errorStringSelector)) {
            const reason = ethers.AbiCoder.defaultAbiCoder().decode(
                ['string'],
                ethers.dataSlice(message ?? "", 4)
            )
            result = reason.toString() ?? null
        } else if (message.startsWith(panicUint256Selector)) {
            const code = ethers.AbiCoder.defaultAbiCoder().decode(
                ['uint256'],
                ethers.dataSlice(message ?? "", 4)
            )
            result = 'Panic(0x' + parseInt(code.toString()).toString(16) + ')'
        } else if (!message.startsWith("0x")) {
            result = message
        } else {
            result = null;
        }
    } catch (reason) {
        result = null
    }

    return result
}

export function makeUnclampedStake(node: NetworkNode): number {
    return (node.stake_rewarded ?? 0) + (node.stake_not_rewarded ?? 0)
}

export function makeStakePercentage(node: NetworkNode, stakeTotal: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: 'percent',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    })
    return formatter.format(node.stake ? node.stake / stakeTotal : 0)
}

export function makeRewardRate(rewardInTinyBar: number): number {
    // rely on mirror node to provide the actual reward rate (tiny bars rewarded per hbar staked)
    // here we simply convert to hbars
    return (rewardInTinyBar ?? 0) / 100000000
}

export function makeAnnualizedRate(rewardInTinyBar: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: 'percent',
        maximumFractionDigits: 3
    })
    return formatter.format(makeRewardRate(rewardInTinyBar) * 365);
}

export function lookupTransactionType(feesResponse: NetworkFeesResponse | null, txType: TransactionType): number | null {
    let result: number | null = null
    let type: string
    switch (txType) {
        case TransactionType.CONTRACTCREATEINSTANCE:
            type = "ContractCreate"
            break
        case TransactionType.CONTRACTCALL:
            type = "ContractCall"
            break
        case TransactionType.ETHEREUMTRANSACTION:
        default:
            type = "EthereumTransaction"
            break
    }
    const networkFees = feesResponse?.fees ?? []
    for (const fee of networkFees) {
        if (fee.transaction_type === type) {
            result = fee.gas
            break
        }
    }
    return result
}

export function lookupNodeByAccountId(accountId: string, nodes: NetworkNode[]): NetworkNode | null {
    let result: NetworkNode | null = null
    for (const n of nodes) {
        if (n.node_account_id == accountId) {
            result = n
            break
        }
    }
    return result
}

export function labelForResponseCode(responseCode: bigint): string | null {
    const responseCodeEnum = hashgraph.proto.ResponseCodeEnum;
    const result = Object.keys(responseCodeEnum).find((key: any) => BigInt(responseCodeEnum[key]) === responseCode);
    return result || null;
}

export function lookupTokenTransfer(transaction: Transaction, tokenId: string): TokenTransfer | null {
    let result: TokenTransfer | null = null
    for (const t of transaction.token_transfers) {
        if (t.token_id == tokenId) {
            result = t
            break
        }
    }
    return result
}

export function lookupNFTTransfer(transaction: Transaction, tokenId: string): NftTransfer | null {
    let result: NftTransfer | null = null
    for (const t of transaction.nft_transfers) {
        if (t.token_id == tokenId) {
            result = t
            break
        }
    }
    return result
}

export function decodeRedirectForTokenInput(functionFragment: ethers.FunctionFragment, inputArgs: string): ethers.Result {
    try {
        return ethers.AbiCoder.defaultAbiCoder().decode(functionFragment.inputs, inputArgs)
    } catch (e) {
        const tokenAddress = `0x${inputArgs.slice(2, 42)}`
        const encodedFunctionSelector = `0x${inputArgs.slice(42)}`
        return new ethers.Result(tokenAddress, encodedFunctionSelector)
    }
}

export function resolveFunctionFragmentForHTSProxyContract(functionFragment: ethers.FunctionFragment, inputArgs: string): ethers.FunctionFragment {
    const inputResult = decodeRedirectForTokenInput(functionFragment, inputArgs)
    const encodedFunction4BytesSignature = inputResult[1].slice(0, 10)

    // @notice this is the list of supported method which is collected based on HIP-218 https://hips.hedera.com/hip/hip-218
    const ABI_FOR_SUPPORTED_METHODS = [
        "function name() public view returns (string name)",
        "function symbol() public view returns (string symbol)",
        "function decimals() public view returns (uint8 decimals)",
        "function totalSupply() external view returns (uint256 totalSupply)",
        "function setApprovalForAll(address _operator, bool _approved) external",
        "function ownerOf(uint256 _tokenId) external view returns (address ownerOf)",
        "function tokenURI(uint256 _tokenId) external view returns (string tokenURI)",
        "function balanceOf(address _owner) external view returns (uint256 balanceOf)",
        "function balanceOf(address account) external view returns (uint256 balanceOf)",
        "function approve(address spender, uint256 amount) external returns (bool approve)",
        "function tokenByIndex(uint256 _index) external view returns (uint256 tokenByIndex)",
        "function getApproved(uint256 _tokenId) external view returns (address getApproved)",
        "function transferFrom(address _from, address _to, uint256 _tokenId) external payable",
        "function transfer(address recipient, uint256 amount) external returns (bool transfer)",
        "function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable",
        "function allowance(address owner, address spender) external view returns (uint256 allowance)",
        "function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable",
        "function isApprovedForAll(address _owner, address _operator) external view returns (bool isApprovedForAll)",
        "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool transferFrom)",
        "function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256 tokenOfOwnerByIndex)",
    ];

    const iface = new ethers.Interface(ABI_FOR_SUPPORTED_METHODS)
    return ethers.FunctionFragment.from({
        ...functionFragment,
        outputs: iface.getFunction(encodedFunction4BytesSignature)?.outputs
    })
}

export function isRedirectForTokenTx(contractId: string, functionHash: string): boolean {
    return contractId === HTS_PRECOMPILE_CONTRACT_ID &&
        functionHash === REDIRECT_FOR_TOKEN_FUNCTION_SIGHASH
}

export async function isValidAssociation(accountId: string | null, tokenId: string | null): Promise<boolean> {
    let result: boolean

    if (accountId && tokenId) {
        const uRL = "api/v1/accounts/" + accountId + "/tokens"
        const params = {
            'token.id': tokenId,
        }
        const response = await axios.get<TokenRelationshipResponse>(uRL, {params: params})
        const tokens = response.data?.tokens ?? []
        result = tokens.length > 0 && tokens[0].token_id === tokenId
    } else {
        result = false
    }
    return Promise.resolve(result)
}

export function labelForAutomaticTokenAssociation(rawProperty: number): string {
    let result: string
    switch (rawProperty) {
        case -1:
            result = 'Unlimited Auto Associations'
            break
        case 0:
            result = 'No Auto Association'
            break
        default:
            result = rawProperty.toString()
    }
    return result
}

export async function waitForTransactionRefresh(transactionId: string, attemptIndex: number = 10, polling = 3000) {
    let result: Promise<Transaction | string>

    if (attemptIndex >= 0) {
        const tid = TransactionID.normalize(transactionId)
        await waitFor(500) // Let's be optimistic
        try {
            const response = await axios.get<TransactionByIdResponse>("api/v1/transactions/" + transactionId)
            const transactions = response.data.transactions ?? []
            result = Promise.resolve(transactions.length >= 1 ? transactions[0] : transactionId)
        } catch {
            result = waitForTransactionRefresh(tid, attemptIndex - 1, polling)
        }
    } else {
        result = Promise.resolve(transactionId)
    }

    return result
}

export async function drainTransactions(r: TransactionResponse, limit: number): Promise<Transaction[]> {
    let result = r.transactions ?? []
    // let i = 1
    while (r.links?.next && result.length < limit) {
        // console.log(`drainTransactions (iteration ${i++})`)
        // console.log(`  - limit:${limit}`)
        // console.log(`  - result.length:${result.length}`)
        // console.log(`  - r.links.next:${r.links.next}`)
        const ar = await axios.get<TransactionResponse>(r.links.next)
        if (ar.data.transactions) {
            result = result.concat(ar.data.transactions)
        }
        r = ar.data
    }
    return result
}

export async function drainAndFilterTransactions(
    r: TransactionResponse,
    limit: number,
    minTinyBar: number,
    account: string
): Promise<Transaction[]> {

    const MAX_DRAIN_ITERATION_WHEN_FILTERING = 40

    // This function is used to filter out what we consider as 'spam' transactions
    // A transaction is considered spam if it contains a transfer involving the user account which has an amount
    // below the limit chosen by the user (e.g. 1 hbar).
    // The amount considered is the (absolute) net value of the transfer -- we deduce the amount of the perceived staking reward if any.
    const filterTinyTxn = (txn: Transaction) => {
        let filter = true
        let reward = 0
        if (txn.name === TransactionType.CRYPTOTRANSFER && minTinyBar > 0) {
            for (const r of txn.staking_reward_transfers) {
                if (r.account === account) {
                    reward = r.amount
                }
            }
            for (const t of txn.transfers) {
                if (t.account === account) {
                    const netAmount = Math.abs(t.amount - reward)
                    if (netAmount < minTinyBar) {
                        filter = false
                    }
                    break
                }
            }
        }
        return filter
    }

    let result = (r.transactions ?? []).filter(filterTinyTxn)
    let i = 0
    while (r.links?.next && result.length < limit && i < MAX_DRAIN_ITERATION_WHEN_FILTERING) {
        // console.log(`drainAndFilterTransactions (iteration ${i + 1})`)
        // console.log(`  - limit:${limit}`)
        // console.log(`  - result.length:${result.length}`)
        // console.log(`  - r.links.next:${r.links.next}`)
        const ar = await axios.get<TransactionResponse>(r.links.next)
        if (ar.data.transactions) {
            result = result.concat(ar.data.transactions.filter(filterTinyTxn))
        }
        r = ar.data
        i += 1
    }
    return result
}

export async function drainAccounts(r: AccountsResponse, limit: number): Promise<AccountInfo[]> {
    let result = r.accounts ?? []
    // let i = 1
    while (r.links?.next && result.length < limit) {
        // console.log("drain iteration: " + i);
        // i += 1
        const ar = await axios.get<AccountsResponse>(r.links.next)
        if (ar.data.accounts) {
            result = result.concat(ar.data.accounts)
        }
        r = ar.data
    }
    return result
}

export async function drainContractResults(r: ContractResultsResponse, limit: number): Promise<ContractResult[]> {
    let result = r.results ?? []
    // let i = 1
    while (r.links?.next && result.length < limit) {
        // console.log("drain iteration: " + i);
        // i += 1
        const ar = await axios.get<ContractResultsResponse>(r.links.next)
        if (ar.data.results) {
            result = result.concat(ar.data.results)
        }
        r = ar.data
    }
    return result
}

export async function drainContractResultsLogs(r: ContractResultsLogResponse, limit: number): Promise<ContractLog[]> {
    let result = r.logs ?? []
    // let i = 1
    while (r.links?.next && result.length < limit) {
        // console.log("drain iteration: " + i);
        // i += 1
        const ar = await axios.get<ContractResultsLogResponse>(r.links.next)
        if (ar.data.logs) {
            result = result.concat(ar.data.logs)
        }
        r = ar.data
    }
    return result
}

//
// From https://github.com/hashgraph/hedera-improvement-proposal/blob/master/assets/hip-15/HIP-15-javascript.html
//
// Given a ledger ID and an address like "0.0.123", return a checksum like "vfmkw" . The address must be in no-checksum
// format, with no extra characters (so not "0.0.00123" or "==0.0.123==" or "0.0.123-vfmkw"). The algorithm is defined
// by the HIP-15 standard to be:
//
// a = a valid no-checksum address string, such as 0.0.123
// d = int array for the digits of a (using 10 to represent "."), so 0.0.123 is [0,10,0,10,1,2,3]
// h = unsigned byte array containing the ledger ID followed by 6 zero bytes
// p3 = 26 * 26 * 26
// p5 = 26 * 26 * 26 * 26 * 26
// sd0 = (d[0] + d[2] + d[4] + d[6] + ...) mod 11
// sd1 = (d[1] + d[3] + d[5] + d[7] + ...) mod 11
// sd = (...((((d[0] * 31) + d[1]) * 31) + d[2]) * 31 + ... ) * 31 + d[d.length-1]) mod p3
// sh = (...(((h[0] * 31) + h[1]) * 31) + h[2]) * 31 + ... ) * 31 + h[h.length-1]) mod p5
// c = (((d.length mod 5) * 11 + sd0) * 11 + sd1) * p3 + sd + sh ) mod p5
// cp = (c * 1000003) mod p5
// checksum = cp, written as 5 digits in base 26, using a-z
//
//in ports to other languages, answer can be a string, digits an int32[] and the rest int32 (or uint32[] and uint32)

export function hip15checksum(ledgerId: string, addr: string) {
    let answer = "";
    const d = [];      //digits with 10 for ".", so if addr == "0.0.123" then d == [0, 10, 0, 10, 1, 2, 3] *** FIX ***
    let sd0 = 0;      //sum of even positions (mod 11)
    let sd1 = 0;      //sum of odd positions (mod 11)
    let sd = 0;       //weighted sum of all positions (mod p3)
    let sh = 0;      //hash of the ledger ID
    let cp: number;       //the checksum, as a single number
    const p3 = 26 * 26 * 26;           //3 digits in base 26
    const p5 = 26 * 26 * 26 * 26 * 26; //5 digits in base 26
    const ascii_a = "a".charCodeAt(0);  //97  *** FIX ***
    const m = 1_000_003; //min prime greater than a million. Used for the final permutation.
    const w = 31; //sum s of digit values weights them by powers of w. Should be coprime to p5.

    let id = ledgerId + "000000000000";
    const h = []; // *** FIX ***
    if (id.length % 2 == 1) id = "0" + id;
    for (let i = 0; i < id.length; i += 2) {  // *** FIX ***
        h.push(parseInt(id.substr(i, 2), 16));
    }
    for (let i = 0; i < addr.length; i++) {
        d.push(addr[i] == "." ? 10 : parseInt(addr[i], 10));
    }
    for (let i = 0; i < d.length; i++) {
        sd = (w * sd + d[i]) % p3;
        if (i % 2 == 0) {
            sd0 = (sd0 + d[i]) % 11;
        } else {
            sd1 = (sd1 + d[i]) % 11;
        }
    }
    for (let i = 0; i < h.length; i++) {
        sh = (w * sh + h[i]) % p5;
    }
    const c = ((((addr.length % 5) * 11 + sd0) * 11 + sd1) * p3 + sd + sh) % p5;  //the checksum, before the final permutation
    cp = (c * m) % p5;

    for (let i = 0; i < 5; i++) {
        answer = String.fromCharCode(ascii_a + (cp % 26)) + answer;
        cp /= 26;
    }

    return answer;
}

export function stripChecksum(address: string): string {
    const dash = address.indexOf('-')
    return dash != -1 ? address.substring(0, dash) : address
}

export function extractChecksum(address: string): string | null {
    const dash = address.indexOf('-')
    return dash != -1 ? address.substring(dash + 1) : null
}

export function computeTPS(blocks: Block[]): number | null { // blocks should be in ascending order
    let result: number | null

    if (blocks.length >= 1) {
        const startBlock = blocks[0]
        const endBlock = blocks[blocks.length - 1]
        const startTime = startBlock.timestamp?.from ?? null
        const endTime = endBlock.timestamp?.to ?? null
        if (startTime !== null && endTime !== null) {
            const rangeNanos = Timestamp.computeRange(startTime, endTime)
            if (rangeNanos !== null) {
                const txCount = countTransactions(blocks)
                return txCount / (rangeNanos / 1_000_000_000)
            } else {
                result = null
            }
        } else {
            result = null
        }
    } else {
        result = null
    }
    return result
}

export function countTransactions(blocks: Block[]): number {
    let result = 0
    for (const b of blocks) {
        result += b.count ?? 0
    }
    return result
}

