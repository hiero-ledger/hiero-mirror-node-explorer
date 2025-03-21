// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Account
// ---------------------------------------------------------------------------------------------------------------------

import {EntityID} from "@/utils/EntityID";
import {makeDefaultNodeDescription} from "@/schemas/MirrorNodeUtils.ts";
import {fetchJSArray, fetchJSObject, fetchJSString} from "@/utils/JSUtils.ts";

export interface AccountsResponse {
    accounts: AccountInfo[] | undefined
    links: Links | undefined
}

export interface AccountInfo {
    account: string | null              // Network entity ID in the format of shard.realm.num
    auto_renew_period: number | null
    balance: Balance | null
    created_timestamp: string | null
    deleted: boolean | null
    expiry_timestamp: string | null
    key: Key | null
    max_automatic_token_associations: number | null
    memo: string | null
    receiver_sig_required: boolean | null
    alias: string | null                // RFC4648 no-padding base32 encoded account alias
    ethereum_nonce: number | null
    evm_address: string | null          // A network entity encoded as an EVM address in hex.
    decline_reward: boolean | null      // Whether the account declines receiving a staking reward
    staked_account_id: string | null    // The account to which this account is staking
    staked_node_id: number | null       // The id of the node to which this account is staking
    stake_period_start: string | null  // The staking period during which either the staking settings for this account
                                       // changed (such as starting staking or changing stakedNode) or the most recent
                                       // reward was earned, whichever is later. If this account is not currently
                                       // staked to a node, then the value is null
    pending_reward: number | undefined  // The pending reward in tinybars the account will receive in the next
                                        // reward payout. Note the value is updated at the end of each staking period
                                        // and there may be delay to reflect the changes in the past staking period.
}

export interface AccountBalanceTransactions extends AccountInfo {
    transactions?: Array<Transaction>
    links?: Links
}

export interface Balance {
    timestamp: string | null
    balance: number | null
    tokens: TokenBalance[]
}

export interface TokenBalance {
    token_id: string | null // Network entity ID in the format of shard.realm.num
    balance: number
}

export interface TokenRelationshipResponse {
    tokens: Array<TokenRelationship>,
    links: Links
}

export interface TokenRelationship {
    automatic_association: boolean,
    balance: number,
    created_timestamp: string,
    freeze_status: FreezeStatus,    // [ NOT_APPLICABLE, FROZEN, UNFROZEN ]
    kyc_status: string,             // [ NOT_APPLICABLE, GRANTED, REVOKED ]
    token_id: string | null,
}

export enum FreezeStatus {
    FROZEN = "FROZEN",
    UNFROZEN = "UNFROZEN",
    NOT_APPLICABLE = "NOT_APPLICABLE"
}

export interface CryptoAllowancesResponse {
    allowances: Array<CryptoAllowance>,
    links: Links
}

export interface CryptoAllowance {
    amount_granted: number,     // The granted amount of the spender's allowance in tinybars.
    owner: string | null,       // Network entity ID in the format of shard.realm.num
    spender: string | null,     // Network entity ID in the format of shard.realm.num
    timestamp: TimestampRange
}

export interface TokenAllowancesResponse {
    allowances: Array<TokenAllowance>,
    links: Links
}

export interface TokenAllowance extends CryptoAllowance {
    token_id: string | null,    // Network entity ID in the format of shard.realm.num
}

export interface NftAllowance {
    approved_for_all: boolean,      // Boolean value indicating if the spender has the allowance to spend all NFTs owned by the given owner
    owner: string | null,           // Network entity ID in the format of shard.realm.num
    spender: string | null,         // Network entity ID in the format of shard.realm.num
    timestamp: TimestampRange,
    token_id: string | null         // Network entity ID in the format of shard.realm.num
}

export interface NftAllowancesResponse {
    allowances: Array<NftAllowance>,
    links: Links
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                   Balance
// ---------------------------------------------------------------------------------------------------------------------

export interface BalancesResponse {
    timestamp: string | null
    balances: Array<AccountBalance>
    links: Links
}

export interface AccountBalance {
    account: string | null // Network entity ID in the format of shard.realm.num
    balance: number
    tokens: Array<TokenBalance>
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                   Transaction
// ---------------------------------------------------------------------------------------------------------------------

export interface TransactionResponse {
    transactions: Array<Transaction> | undefined
    links: Links | undefined
}

export interface NftTransactionHistory {
    transactions: Array<NftTransactionTransfer> | undefined
    links: Links | undefined
}

export interface TransactionByIdResponse {
    transactions: Array<TransactionDetail> | undefined
}

export interface Transaction {

    bytes: string | null
    charged_tx_fee: number
    consensus_timestamp: string
    entity_id: string | null           // Network entity ID in the format of shard.realm.num
    max_fee: string
    memo_base64: string | null         // To be checked
    name: TransactionType
    nft_transfers: NftTransfer[]
    node: string | null                // Network entity ID in the format of shard.realm.num
    nonce: number
    parent_consensus_timestamp: string | null
    result: string
    scheduled: boolean
    staking_reward_transfers: StakingRewardTransfer[]
    token_transfers: TokenTransfer[]
    transaction_hash: string
    transaction_id: string
    transfers: Transfer[]
    valid_duration_seconds: string
    valid_start_timestamp: string
}

export interface NftTransactionTransfer {
    consensus_timestamp: string | undefined
    nonce: number | undefined
    transaction_id: string | undefined
    type: TransactionType | undefined
    is_approval: false
    receiver_account_id: string | null | undefined // account ID in the format of shard.realm.num
    sender_account_id: string | null | undefined // account ID in the format of shard.realm.num
}

export interface TransactionDetail extends Transaction {

    assessed_custom_fees: CustomFee[]
}


export interface NftTransfer {
    receiver_account_id: string | null | undefined  // Network entity ID in the format of shard.realm.num
    sender_account_id: string | null | undefined    // Network entity ID in the format of shard.realm.num
    is_approval: boolean
    serial_number: number
    token_id: string | null                         // Network entity ID in the format of shard.realm.num}
}

export function compareNftTransfer(t1: NftTransfer, t2: NftTransfer): number {

    let result = compareString(t1.sender_account_id, t2.sender_account_id)

    if (result == 0) {
        result = compareString(t1.token_id, t2.token_id)
    }

    if (result == 0) {
        result = compareString(t1.receiver_account_id, t2.receiver_account_id)
    }

    if (result == 0) {
        result = compareNumber(t1.serial_number, t2.serial_number)
    }

    return result
}

export interface Transfer {
    account: string | null                          // Network entity ID in the format of shard.realm.num
    amount: number
    is_approval: boolean | undefined
}

export interface TokenTransfer extends Transfer {
    token_id: string | null                         // Network entity ID in the format of shard.realm.num
}

export interface StakingRewardTransfer {
    account: string | null                          // Network entity ID in the format of shard.realm.num
    amount: number
}

export interface CustomFee {
    amount: number | undefined
    collector_account_id: string | undefined        // Network entity ID in the format of shard.realm.num
    effective_payer_account_ids: string[] | undefined
    token_id: string | null | undefined             // Network entity ID in the format of shard.realm.num
}

export enum TransactionType {
    CONSENSUSCREATETOPIC = "CONSENSUSCREATETOPIC",
    CONSENSUSDELETETOPIC = "CONSENSUSDELETETOPIC",
    CONSENSUSSUBMITMESSAGE = "CONSENSUSSUBMITMESSAGE",
    CONSENSUSUPDATETOPIC = "CONSENSUSUPDATETOPIC",
    CONTRACTCALL = "CONTRACTCALL",
    CONTRACTCREATEINSTANCE = "CONTRACTCREATEINSTANCE",
    CONTRACTDELETEINSTANCE = "CONTRACTDELETEINSTANCE",
    CONTRACTUPDATEINSTANCE = "CONTRACTUPDATEINSTANCE",
    CRYPTOADDLIVEHASH = "CRYPTOADDLIVEHASH",
    CRYPTOCREATEACCOUNT = "CRYPTOCREATEACCOUNT",
    CRYPTODELETE = "CRYPTODELETE",
    CRYPTODELETELIVEHASH = "CRYPTODELETELIVEHASH",
    CRYPTOTRANSFER = "CRYPTOTRANSFER",
    CRYPTOUPDATEACCOUNT = "CRYPTOUPDATEACCOUNT",
    CRYPTOAPPROVEALLOWANCE = "CRYPTOAPPROVEALLOWANCE",
    CRYPTODELETEALLOWANCE = "CRYPTODELETEALLOWANCE",
    ETHEREUMTRANSACTION = "ETHEREUMTRANSACTION",
    FILEAPPEND = "FILEAPPEND",
    FILECREATE = "FILECREATE",
    FILEDELETE = "FILEDELETE",
    FILEUPDATE = "FILEUPDATE",
    FREEZE = "FREEZE",
    NODECREATE = "NODECREATE",
    NODEDELETE = "NODEDELETE",
    NODESTAKEUPDATE = "NODESTAKEUPDATE",
    NODEUPDATE = "NODEUPDATE",
    SCHEDULECREATE = "SCHEDULECREATE",
    SCHEDULEDELETE = "SCHEDULEDELETE",
    SCHEDULESIGN = "SCHEDULESIGN",
    SYSTEMDELETE = "SYSTEMDELETE",
    SYSTEMUNDELETE = "SYSTEMUNDELETE",
    TOKENASSOCIATE = "TOKENASSOCIATE",
    TOKENAIRDROP = "TOKENAIRDROP",
    TOKENBURN = "TOKENBURN",
    TOKENCANCELAIRDROP = "TOKENCANCELAIRDROP",
    TOKENCLAIMAIRDROP = "TOKENCLAIMAIRDROP",
    TOKENCREATION = "TOKENCREATION",
    TOKENDELETION = "TOKENDELETION",
    TOKENDISSOCIATE = "TOKENDISSOCIATE",
    TOKENFEESCHEDULEUPDATE = "TOKENFEESCHEDULEUPDATE",
    TOKENFREEZE = "TOKENFREEZE",
    TOKENGRANTKYC = "TOKENGRANTKYC",
    TOKENMINT = "TOKENMINT",
    TOKENPAUSE = "TOKENPAUSE",
    TOKENREJECT = "TOKENREJECT",
    TOKENREVOKEKYC = "TOKENREVOKEKYC",
    TOKENUNFREEZE = "TOKENUNFREEZE",
    TOKENUNPAUSE = "TOKENUNPAUSE",
    TOKENUPDATE = "TOKENUPDATE",
    TOKENUPDATENFTS = "TOKENUPDATENFTS",
    TOKENWIPE = "TOKENWIPE",
    UNCHECKEDSUBMIT = "UNCHECKEDSUBMIT",
    UTILPRNG = "UTILPRNG"
}

export enum TransactionResult {
    SUCCESS = "success",
    FAILURE = "fail"
}

export function compareTransferByAccount(t1: Transfer | StakingRewardTransfer, t2: Transfer | StakingRewardTransfer): number {
    let result: number
    const account1 = t1.account
    const account2 = t2.account
    if (account1 != null && account2 != null) {
        const accountId1 = EntityID.parse(account1)
        const accountId2 = EntityID.parse(account2)
        if (accountId1 != null && accountId2 != null) {
            result = accountId1.compareAccountID(accountId2)
        } else {
            result = account1.localeCompare(account2);
        }
    } else if (account1 != null) {
        result = +1
    } else if (account2 != null) {
        result = -1
    } else {
        result = 0
    }
    return result
}

export function compareTokenTransferByTokenId(t1: TokenTransfer, t2: TokenTransfer): number {
    return compareString(t1.token_id, t2.token_id)
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Schedule
// ---------------------------------------------------------------------------------------------------------------------

export interface Schedule {
    admin_key: Key | null
    consensus_timestamp: string
    creator_account_id: string | null
    deleted: boolean
    executed_timestamp: string | null
    expiration_time: string | null
    memo: string
    payer_account_id: string | null
    schedule_id: string | null
    signatures: ScheduleSignature[]
    transaction_body: string
    wait_for_expiry: boolean
}

export interface ScheduleSignature {
    consensus_timestamp: string
    public_key_prefix: string
    signature: string
    type: SignatureType
}

export enum SignatureType {
    CONTRACT = "CONTRACT",
    ED25519 = "ED25519",
    RSA_3072 = "RSA_3072",
    ECDSA_384 = "ECDSA_384",
    ECDSA_SECP256K1 = "ECDSA_SECP256K1",
    UNKNOWN = "UNKNOWN",
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Token
// ---------------------------------------------------------------------------------------------------------------------

export interface TokensResponse {
    tokens: Token[] | undefined
    links: Links | undefined
}

export interface Token {
    admin_key: Key | null
    decimals: number
    metadata: string
    name: string
    symbol: string
    token_id: string | null
    type: string // FUNGIBLE_COMMON, NON_FUNGIBLE_UNIQUE
}

export enum TokenType {
    FUNGIBLE_COMMON = "FUNGIBLE_COMMON",
    NON_FUNGIBLE_UNIQUE = "NON_FUNGIBLE_UNIQUE"
}

export interface TokenInfo {

    admin_key: Key | null
    auto_renew_account: string | null   // Network entity ID in the format of shard.realm.num
    auto_renew_period: number | null
    created_timestamp: string
    decimals: string
    deleted: boolean | null
    expiry_timestamp: string | null
    fee_schedule_key: Key | null
    freeze_default: boolean
    freeze_key: Key | null
    initial_supply: string
    kyc_key: Key | null
    max_supply: string
    metadata: string
    metadata_key: Key | null
    modified_timestamp: string
    name: string
    memo: string
    pause_key: Key | null
    pause_status: string // NOT_APPLICABLE, PAUSED, UNPAUSED
    supply_key: Key | null
    supply_type: string // FINITE, INFINITE
    symbol: string
    token_id: string | null     // Network entity ID in the format of shard.realm.num
    total_supply: string
    treasury_account_id: string | null   // Network entity ID in the format of shard.realm.num
    type: string // FUNGIBLE_COMMON, NON_FUNGIBLE_UNIQUE
    wipe_key: Key | null
    custom_fees: CustomFees
}

export interface CustomFees {
    created_timestamp: string
    fixed_fees: FixedFee[]                       // Always present
    fractional_fees: FractionalFee[] | undefined // Present when FUNGIBLE
    royalty_fees: RoyaltyFee[] | undefined       // Present when NON_FUNGIBLE
}

export interface FixedFee {
    all_collectors_are_exempt: boolean
    amount: number
    collector_account_id: string | null          // Network entity ID in the format of shard.realm.num
    denominating_token_id: string | null         // Network entity ID in the format of shard.realm.num
}

export interface FractionalFee {
    all_collectors_are_exempt: boolean
    amount: FractionAmount
    collector_account_id: string | null          // Network entity ID in the format of shard.realm.num
    denominating_token_id: string | null         // Network entity ID in the format of shard.realm.num
    maximum: number | null
    minimum: number
    net_of_transfers: boolean
}

export interface RoyaltyFee {
    all_collectors_are_exempt: boolean
    amount: FractionAmount
    collector_account_id: string | null          // Network entity ID in the format of shard.realm.num
    fallback_fee: FallbackFee                    // Network entity ID in the format of shard.realm.num
}

export interface FallbackFee {
    amount: number
    denominating_token_id: string | null         // Network entity ID in the format of shard.realm.num
}

export interface FractionAmount {
    numerator: number
    denominator: number
}

export interface TokenBalancesResponse {
    timestamp: string | null | undefined
    balances: TokenDistribution[] | undefined
    links: Links | undefined
}

export interface TokenDistribution {
    account: string | null // Network entity ID in the format of shard.realm.num
    balance: number
}

// ---------------------------------------------------------------------------------------------------------------------
//                                               Nft
// ---------------------------------------------------------------------------------------------------------------------

export interface Nfts {
    nfts: Nft[] | undefined
    links: Links | undefined
}

export interface Nft {
    account_id: string | null // Network entity ID in the format of shard.realm.num
    created_timestamp: string | null
    delegating_spender: string | null
    deleted: boolean
    metadata: string
    modified_timestamp: string | null
    serial_number: number
    spender: string | null
    token_id: string | null // Network entity ID in the format of shard.realm.num
}

// ---------------------------------------------------------------------------------------------------------------------
//                                               Airdrop
// ---------------------------------------------------------------------------------------------------------------------

export interface TokenAirdropsResponse {
    airdrops: TokenAirdrop[]
    links: Links
}

export interface TokenAirdrop {
    amount: number,
    receiver_id: string | null,
    sender_id: string | null,
    serial_number: number | null | undefined,
    timestamp: TimestampRange,
    token_id: string | null
}

// ---------------------------------------------------------------------------------------------------------------------
//                                               Topic
// ---------------------------------------------------------------------------------------------------------------------

export interface Topic {
    admin_key: Key | null
    auto_renew_account: string | null // Network entity ID in the format of shard.realm.num
    auto_renew_period: number | null
    created_timestamp: string | null
    custom_fees: ConsensusCustomFees
    deleted: boolean | null
    fee_exempt_key_list: Key[]
    fee_schedule_key: Key | null
    memo: string
    submit_key: Key | null
    timestamp: TimestampRange   // timestamp range the entity is valid for
    topic_id: string | null // Network entity ID in the format of shard.realm.num
}

export interface ConsensusCustomFees {
    created_timestamp: string
    fixed_fees: FixedCustomFee[]
}

export interface FixedCustomFee {
    amount: number
    collector_account_id: string | null
    denominating_token_id: string | null
}

// ---------------------------------------------------------------------------------------------------------------------
//                                               TopicMessagesResponse
// ---------------------------------------------------------------------------------------------------------------------

export interface TopicMessagesResponse {
    messages: Array<TopicMessage>
    links: Links
}

export interface TopicMessage {
    chunk_info: ChunkInfo | null,
    consensus_timestamp: string,
    topic_id: string | null,
    message: string,
    running_hash: string,
    running_hash_version: number,
    sequence_number: number
}

export interface ChunkInfo {
    initial_transaction_id: TransactionId,
    number: number,
    total: number
}

export interface TransactionId {
    account_id: string | null,
    nonce: number | null,
    scheduled: boolean | null,
    transaction_valid_start: string
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Contract
// ---------------------------------------------------------------------------------------------------------------------

export interface ContractsResponse {
    contracts: Contract[] | undefined
    links: Links | undefined
}

export interface Contract {

    admin_key: Key | null
    auto_renew_account: string | null   // Network entity ID in the format of shard.realm.num
    auto_renew_period: number | null
    contract_id: string | null   // Network entity ID in the format of shard.realm.num
    created_timestamp: string | null
    deleted: boolean
    evm_address: string
    expiration_timestamp: string | null
    file_id: string | null | undefined   // Network entity ID in the format of shard.realm.num
    max_automatic_token_associations: number | null
    memo: string
    nonce: number | undefined
    obtainer_id: string | null   // Network entity ID in the format of shard.realm.num
    permanent_removal: boolean | null
    proxy_account_id: string | null   // Network entity ID in the format of shard.realm.num
    timestamp: TimestampRange   // timestamp range the entity is valid for
}

export interface ContractResponse extends Contract {
    bytecode: string | null
    runtime_bytecode: string | null
}

export interface TimestampRange {
    from: string | undefined    // The inclusive from timestamp in seconds
    to: string | null | undefined   // The exclusive to timestamp in seconds
}

export interface ContractResultsResponse {
    results: Array<ContractResult> | undefined
    links: Links | undefined
}

export interface ContractResult {
    access_list: string | null
    address: string | null
    amount: number | null
    block_gas_used: number | null // integer
    block_hash: string | null
    block_number: number | null // integer
    bloom: string | null
    call_result: string | null
    chain_id: string | null
    contract_id: string | null
    created_contract_ids: Array<string> | null
    error_message: string | null
    failed_initcode: string
    from: string
    function_parameters: string
    gas_limit: number
    gas_price: string | null
    gas_used: number | null
    gas_consumed: number | null
    hash: string | null
    max_fee_per_gas: string | null
    max_priority_fee_per_gas: string | null
    nonce: number | null // integer
    r: string | null
    result: string
    s: string | null
    status: string
    timestamp: string
    to: string | null
    transaction_index: number | null // integer
    type: number | null // The type of the wrapped ethereum transaction, 0 (Pre-Eip1559) or 2 (Post-Eip1559)
    v: number | null
}

export interface ContractResultDetails extends ContractResult {
    logs: ContractLog[] | undefined
    state_changes: ContractResultStateChange[]
}

export interface ContractResultLog {
    address: string | undefined
    bloom: string | null | undefined
    contract_id: string | null | undefined
    data: string | null | undefined
    index: number | undefined // integer
    topics: string[] | undefined
}

export interface ContractLog extends ContractResultLog {
    block_hash?: string,
    block_number?: number,
    root_contract_id?: string | null,
    timestamp?: string,
    transaction_hash?: string,
    transaction_index?: number | null, //integer
}

export interface ContractResultsLogResponse {
    logs: ContractLog[],
    links: Links | undefined
}

export interface ContractResultStateChange {
    address: string | undefined
    contract_id: string | null | undefined
    slot: string | undefined
    value_read: string | undefined
    value_written: string | null | undefined
}

export interface ContractActionsResponse {
    actions: Array<ContractAction> | undefined
    links: Links | undefined
}

export interface ContractAction {
    call_depth: number | undefined,
    call_operation_type: string | undefined,
    call_type: string | undefined,
    caller: string | null | undefined, // Network entity ID in the format of shard.realm.num
    caller_type: string | undefined,   // enum EntityType
    from: string | undefined,
    gas: number | undefined,
    gas_used: number | undefined,
    index: number | undefined,
    input: string | null | undefined,
    recipient: string | null | undefined,
    recipient_type: string | null | undefined, // enum EntityType
    result_data: string | null | undefined,
    result_data_type: string | undefined,      // enum ResultDataType
    timestamp: string | undefined,
    to: string | null | undefined,
    value: number | undefined
}

export enum EntityType {
    ACCOUNT = "ACCOUNT",
    CONTRACT = "CONTRACT"
}

export enum ResultDataType {
    OUTPUT = "OUTPUT",
    REVERT_REASON = "REVERT_REASON",
    ERROR = "ERROR"
}

export interface ContractCallRequest {
    block?: string | null      // Hexadecimal block number or the string "latest", "pending", "earliest". Defaults to "latest"
    data?: string | null       // Hexadecimal method signature and encoded parameters
    estimate?: boolean | null  // Whether gas estimation is called. Defaults to false
    from?: string | null       // The 20-byte hexadecimal EVM address the transaction is sent from
    gas?: number | null        // Gas provided for the transaction execution. Defaults to 15000000
    gasPrice?: number | null   // Gas price used for each paid gas
    to: string               // The 20-byte hexadecimal EVM address the transaction is directed to
    value?: number | null      // Value sent with this transaction. Defaults to 0
}

export interface ContractCallResponse {
    result: string          // Result in hexadecimal from executed contract call
}


export interface ContractStateResponse {
    state: Array<ContractState> | undefined
    links: Links | undefined
}

export interface ContractState {
    address: string         // A network entity encoded as an EVM address in hex
    contract_id: string     // Network entity ID in the format of shard.realm.num
    timestamp: string       // A Unix timestamp in seconds.nanoseconds format
    slot: string            // The hex encoded storage slot
    value: string           // The hex encoded value to the slot. 0x implies no value written
}


// ---------------------------------------------------------------------------------------------------------------------
//                                                      Node
// ---------------------------------------------------------------------------------------------------------------------

export interface NetworkNodesResponse {
    nodes: NetworkNode[] | undefined
    links: Links | undefined
}

export interface NetworkNode {
    admin_key: Key | null
    description: string | null
    file_id: string | null          // Network entity ID in the format of shard.realm.num
    memo: string
    node_id: number
    node_account_id: string | null  // Network entity ID in the format of shard.realm.num
    node_cert_hash: string | null
    public_key: string | null       // hex encoded X509 RSA public key used to sign stream files
    service_endpoints: ServiceEndPoint[]
    timestamp: TimestampRange
    max_stake: number | null // The maximum stake (rewarded or not rewarded) this node can have as consensus weight
    min_stake: number | null // The minimum stake (rewarded or not rewarded) this node must reach before having non-zero consensus weight
    stake: number | null // The node consensus weight at the beginning of the staking period
    stake_not_rewarded: number | null // The sum (balance + stakedToMe) for all accounts staked to this node with declineReward=true at the beginning of the staking period
    stake_rewarded: number | null // The sum (balance + staked) for all accounts staked to the node that are not declining rewards at the beginning of the staking period
    staking_period: TimestampRange | null
    reward_rate_start: number | null
}

export interface ServiceEndPoint {
    ip_address_v4: string
    port: number
}

export function makeShortNodeDescription(description: string): string {
    const separator = description.indexOf('|') ?? -1
    return (separator !== -1) ? (description.slice(0, separator) ?? null) : description
}

export function makeNodeSelectorDescription(node: NetworkNode): string {
    const percentFormatter = new Intl.NumberFormat("en-US", {
        style: 'percent',
        maximumFractionDigits: 1
    })
    const unclampedStakeAmount = (node.stake_rewarded ?? 0) + (node.stake_not_rewarded ?? 0)
    const percentMin = node.min_stake ? unclampedStakeAmount / node.min_stake : 0
    const percentMax = node.max_stake ? (node.stake_rewarded ?? 0) / node.max_stake : 0

    let result = node.node_id
        + ' - '
        + (node.description ?? makeDefaultNodeDescription(node.node_id ?? null))

    if (percentMin !== 0 && percentMin < 1) {
        result += " - Not Rewarding (total stake is " + percentFormatter.format(percentMin) + " of min)"
    } else if (percentMax !== 0) {
        result += " - Rewarding (staked for reward is " + percentFormatter.format(percentMax) + " of max)"
    }
    return result
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Network
// ---------------------------------------------------------------------------------------------------------------------

export interface NetworkExchangeRateSetResponse {
    current_rate: ExchangeRate,
    next_rate: ExchangeRate,
    timestamp: string
}

export interface ExchangeRate {
    cent_equivalent: number,
    expiration_time: number,
    hbar_equivalent: number
}

export interface NetworkSupplyResponse {
    released_supply: string | undefined  // The network's released supply of hbars in tinybars
    timestamp: string | undefined  // The consensus timestamp at which the released supply was valid
    total_supply: string | undefined  // The network's total supply of hbars in tinybars
}

export interface NetworkStake {
    max_stake_rewarded: number,               // The maximum amount of tinybar that can be staked for reward while still
                                              // achieving the maximum per-hbar reward rate
    max_staking_reward_rate_per_hbar: number, // The maximum reward rate, in tinybars per whole hbar, that any account can receive in a day
    max_total_reward: number,                 // The total tinybars to be paid as staking rewards in the ending period,
                                              // after applying the settings for the 0.0.800 balance threshold and the maximum stake rewarded
    node_reward_fee_fraction: number,         // The fraction between zero and one of the network and service fees paid to the node reward account 0.0.801
    reserved_staking_rewards: number,         // The amount of the staking reward funds of account 0.0.800 reserved to
                                              // pay pending rewards that have been earned but not collected
    reward_balance_threshold: number,         // The unreserved tinybar balance of account 0.0.800 required to achieve the maximum per-hbar reward rate
    stake_total: number,                      // The total amount staked to the network in tinybars the start of the current staking period
    staking_period: TimestampRange,           // The timestamp range of the staking period
    staking_period_duration: number,          // The number of minutes in a staking period
    staking_periods_stored: number,           // The number of staking periods for which the reward is stored for each node
    staking_reward_fee_fraction: number,      // The fraction between zero and one of the network and service fees paid
                                              // to the staking reward account 0.0.800
    staking_reward_rate: number,              // The total number of tinybars to be distributed as staking rewards each period
    staking_start_threshold: number,          // The minimum balance of staking reward account 0.0.800 required to active rewards
    unreserved_staking_reward_balance: number // The unreserved balance of account 0.0.800 at the close of the just-ending period;
                                              // this value is used to compute the HIP-782 balance ratio
}

export interface NetworkFeesResponse {
    fees: NetworkFee[],
    timestamp: string
}

export interface NetworkFee {
    gas: number,              // gas cost in tinybars
    transaction_type: string
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Block
// ---------------------------------------------------------------------------------------------------------------------

export interface BlocksResponse {
    blocks: Array<Block> | undefined
    links: Links | undefined
}

export interface Block {
    count: number | undefined // integer - minimum 0
    gas_used: number | null | undefined // integer - minimum 0
    hapi_version: string | undefined
    hash: string | undefined
    logs_bloom: string | null | undefined // pattern ^0x[0-9a-fA-F]{512}$
    name: string | undefined
    number: number | undefined
    previous_hash: string | undefined
    size: number | null | undefined // integer
    timestamp: TimestampRange | undefined
}

export interface TimestampRange {
    from: string | undefined // pattern: ^\d{1,10}(\.\d{1,9})?$
    to: string | null | undefined // pattern: ^\d{1,10}(\.\d{1,9})?$
}

// ---------------------------------------------------------------------------------------------------------------------
//                                               StakingRewardTransfer
// ---------------------------------------------------------------------------------------------------------------------

export interface StakingRewardsResponse {
    rewards: Array<StakingReward> | undefined
    links: Links | undefined
}

export interface StakingReward {
    account_id: string | null
    amount: number
    timestamp: string
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Error
// ---------------------------------------------------------------------------------------------------------------------

export interface ErrorBody {
    _status: {
        messages: [
            {
                data: string | null | undefined     // Error message in hexadecimal - pattern: ^0x[0-9a-fA-F]+$
                detail: string | null | undefined   // Detailed error message
                message: string | undefined       // Error message
            }
        ] | undefined
    } | undefined
}

export function extractMessageFromErrorBody(body: unknown): string | null {
    const _status = fetchJSObject(body, "_status")
    const messages = fetchJSArray(_status, "messages")
    const message0 = messages !== null && messages.length >= 1 ? messages[0] : null
    return message0 !== null ? fetchJSString(message0, "message") : null
}

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Misc
// ---------------------------------------------------------------------------------------------------------------------

export interface Key {
    _type: KeyType
    key: string
}

export enum KeyType {
    ECDSA_SECP256K1 = "ECDSA_SECP256K1",
    ED25519 = "ED25519",
    ProtobufEncoded = "ProtobufEncoded"
}

export interface Links {
    next: string | null
}

export const infiniteDuration = 31556888202959784
export const HTS_PRECOMPILE_CONTRACT_ID = "0.0.359"
export const REDIRECT_FOR_TOKEN_FUNCTION_SIGHASH = "0x618dc65e"

// ---------------------------------------------------------------------------------------------------------------------
//                                                      Private
// ---------------------------------------------------------------------------------------------------------------------

function compareString(s1: string | null | undefined, s2: string | null | undefined): number {
    let result: number

    if (s1 && s2) {
        result = s1.localeCompare(s2)
    } else if (s1) {
        // s2 is null or undefined
        result = +1
    } else if (s2) {
        // s1 is null or undefined
        result = -1
    } else {
        result = 0
    }
    return result
}

function compareNumber(n1: number | null | undefined, n2: number | null | undefined): number {
    let result: number

    if (n1 && n2) {
        if (n1 < n2) {
            result = -1
        } else if (n1 > n2) {
            result = +1
        } else {
            result = 0
        }
    } else if (n1) {
        // n2 is null or undefined
        result = +1
    } else if (n2) {
        // n1 is null or undefined
        result = -1
    } else {
        result = 0
    }
    return result
}
