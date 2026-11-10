# **CLPR Support in Mirror Node Explorer**

# 1.0 Objective

Enhance the Hiero Mirror Node Explorer to support HIP-1535 CLPR (Cross Ledger Protocol), including:

- Channels
- Connectors
- Messages
- Ledger configuration and endpoint manifest

The implementation is based on the CLPR REST API of the mirror node (`/api/v1/clpr/...`, see the mirror node CLPR
design doc), and follows the existing explorer UX patterns:

- Top-level tab with sub-tabs
- Table views
- Detail pages, with sub-tabs where needed

Design principle: **no fan-out**. The API only allows querying messages and connectors within one channel. No view or
search issues one request per channel to aggregate or look up across channels: every view works from channel-level
data, or from a single channel.

Every displayed value has one of three sources, used as a legend in this document:

| Tag | Source |
| --- | --- |
| **[API]** | A field of a REST API response, shown as is |
| **[CONST]** | A constant held in the Explorer (code or configuration) |
| **[DERIVED]** | A computation on [API] data, or on [API] and [CONST] data |

# 2.0 New Transaction Types

CLPR introduces new transaction types which the explorer has to recognize so they can be properly labeled and added as filtering options.

There is **no specific rendering** of the content of these transactions:
- The transaction details show the generic transaction information (identifier, result, timestamps, payer, fees,
  transfers), as for any type without a dedicated rendering.
- The content summary of transaction tables stays empty for these types.
- The only addition is a **cross-link** in the transaction details of `ClprCompleteChannel` transactions, to **the
  channel**. It is shown when the channel can be resolved:
  - found through `/clpr/channels?timestamp=eq:{timestamp}` which returns at most one channel
  - not shown for a failed transaction, nor once a closed channel has been reactivated
- No other cross-navigation is available from transactions to CLPR entities.

| Type | Label                     | Purpose |
| --- |---------------------------| --- |
| `ClprUpdateLedgerConfiguration` | CLPR UPDATE CONFIGURATION | Updates the ledger configuration |
| `ClprRegisterChannel` | CLPR REGISTER CHANNEL     | First phase of a channel registration (commitment) |
| `ClprCompleteChannel` | CLPR COMPLETE CHANNEL     | Completes a channel registration: the channel becomes active |
| `ClprCloseChannel` | CLPR CLOSE CHANNEL        | Closes a channel |
| `ClprSubmitBundle` | CLPR SUBMIT BUNDLE        | Carries the peer's messages and acknowledgements into this ledger |
| `ClprRegisterConnector` | CLPR REGISTER CONNECTOR   | First phase of a connector registration (commitment) |
| `ClprCompleteConnector` | CLPR COMPLETE CONNECTOR   | Completes a connector registration |
| `ClprDeregisterConnector` | CLPR DEREGISTER CONNECTOR | Deregisters a connector |
| `ClprMaintenance` | CLPR MAINTENANCE          | System-initiated: ledger configuration and endpoint manifest updates |

# 3.0 Explorer Structure & Routes

## 3.1 Top-Level Navigation

A new top-level tab **CLPR**, placed after Metrics and always shown, with the following sub-tabs:

CLPR

├── **Overview**

├── **Messages**

├── **Channels**

├── **Connectors**

└── **Configuration**

## 3.2 Routes

| Route | Content |
| --- | --- |
| `/{network}/clpr` | Overview (default sub-tab) |
| `/{network}/clpr/messages` | Messages table |
| `/{network}/clpr/messages/{channelId}/{timestamp}/{messageId}` | Message details |
| `/{network}/clpr/channels` | Channels table |
| `/{network}/clpr/channels/{channelId}` | Channel details |
| `/{network}/clpr/connectors` | Connectors table |
| `/{network}/clpr/connectors/{channelId}/{connectorId}` | Connector details |
| `/{network}/clpr/configuration` | Configuration |

Entity identity, driven by the API:

- **Channel:** `channelId` (`channel.id=eq:`).
- **Connector:** `channelId` + `connectorId`, since connectors are only queryable per channel.
- **Message:** `channelId` + `messageId`, with the **timestamp** carried in the route. The messages API requires a
  `timestamp`, has no `message.id` filter, and several messages dispatched by one bundle share a timestamp. The page
  queries `timestamp=eq:{timestamp}` and selects the row with the message id.

Note:

- Detail pages are not sub-tabs: they replace the content of their parent sub-tab (Messages, Channels or Connectors).
  The parent sub-tab stays highlighted, and clicking it returns to its table.
- Sub-tabs inside detail pages are local to the page (not routes).

## 3.3 Table Conventions

- Remain consistent with the existing Explorer convention for tables: 
  - A click everywhere in a row routes to the entity details
  - (Hence) there is **no link inside table cells**.
- Rows without a destination are not clickable (e.g. pending channels and pending connectors, which have no channel id or connector id yet). 
- The page pagination buttons are hidden when everything fits in one page, and the page size selector is
  hidden when there are fewer rows than its smallest option.
- Where a view needs a channel selector over channels (because the API requires one channel), there is
 no "All" option. The selector is introduced by a `CHANNEL:` label.

# 4.0 Sub-tab Views

## 4.1 Overview

**Header Content:**

Cross Ledger Protocol on this network: channels to peer ledgers, the messages moving through them, and the connectors
that pay for delivery.

### Summary Tiles

| Tile | Value | Source |
| --- | --- | --- |
| Channels | Active / total | [DERIVED] from channels |
| Paused channels | Count | [DERIVED] from channels |
| Outbound backlog | Sum of channel backlogs | [DERIVED] |
| Pending channels | Channels registered and not completed | [API] count, `status=PENDING` |

### Channel Status Table

| Channel | Peer Chain | Status | Backlog |
| --- | --- | --- | --- |

Paused channels come first. A click on a row routes to the channel details.

### Needs Attention

| What | Where | Detail | Since |
| --- | --- | --- | --- |

[DERIVED] list, built from:

- Paused channels
- Pending channel registrations committed more than 24 hours ago

A click on a row routes to the channel details, when there is one (not for a pending registration).

The Overview is limited to channel-level data (see the no fan-out principle in 1.0): connector states and stale channels
would need one request per channel, and are therefore not part of it. The channel health and the connector states are
shown on the channel and connector pages.

API: the channels list (`GET /clpr/channels`, and the same endpoint with `status=PENDING` for the pending channels).

---

## 4.2 Messages Tab

Header controls: `CHANNEL:` selector (defaults to the first channel), connector selector (`CONNECTORS: ALL`), type
selector (`TYPES: ALL`).

### Table Columns

| ID | Type | Sender | Target | Connector | Acknowledged | Response | Reply To | Time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

### Column Definitions

- **ID** – `message_id`, unique within the channel
- **Type** – DATA, RESPONSE or CONTROL
- **Sender / Target** – `sender` and `target_application` (hex)
- **Connector** – `connector_id` (null for Response and Control messages)
- **Acknowledged** – tick if the peer has acknowledged the message, empty otherwise (`acknowledged` is computed by the
  API from the channel's acknowledged-through counter)
- **Response** – `reply_status`, only set on Response messages
- **Reply To** – `reply_to_message_id`, the peer message a Response answers
- **Time** – consensus `timestamp`

Clicking a row routes to `/{network}/clpr/messages/{channelId}/{timestamp}/{messageId}`.

API: `/clpr/channels/{channelId}/messages` (`type`, `connector.id`, `timestamp`, `limit`, `order`). The API requires a
`timestamp` range, and the `type` filter is only allowed with it.

## 4.3 Channels Tab

Header controls: status selector (`STATUS: ALL`, PENDING, ACTIVE, PAUSED, CLOSING, DRAINED, CLOSED).

### Table Columns

| Channel ID | Peer Chain | Status | Verifier | Backlog | Ownership Commitment | Created |
| --- | --- | --- | --- | --- | --- | --- |

### Column Definitions

- **Channel ID / Peer Chain** – `channel_id`, `chain_id` (CAIP-2)
- **Status** – `status`
- **Verifier** – `verifier_contract_id`
- **Backlog** – [DERIVED] `next_message_id − 1 − acked_message_id`
- **Ownership Commitment** – `ownership_commitment`, the only identifier of a pending channel
- **Created** – `created_timestamp`

Pending channels (`status=PENDING`) have no channel id, peer chain, verifier or backlog, and their rows are not
clickable. Other rows route to `/{network}/clpr/channels/{channelId}`.

API: `/clpr/channels` (`status`, `timestamp`, `limit`, `order`). Peer chain is not filterable.

## 4.4 Connectors Tab

Header controls: `CHANNEL:` selector, state selector (`STATES: ALL`).

### Table Columns

| Connector ID | Contract | Locked Stake | In-flight | Slashes | State | Created |
| --- | --- | --- | --- | --- | --- | --- |

### Column Definitions

- **Connector ID / Contract** – `connector_id`, `connector_contract_id` (null until the registration is completed)
- **Locked Stake** – `locked_stake` (tinybars, shown in ℏ), against the minimum stake [CONST], with a bar
- **In-flight** – `in_flight_message_count`, against the connector quota [DERIVED], with a bar
- **Slashes** – `slash_count`, against the ban threshold [CONST], with a bar
- **State** – [DERIVED] from `status` (ACTIVE or DELETED), the slash count and the stake: Healthy, Low stake, Near ban, Banned or Deregistered
- **Created** – `created_timestamp`

Clicking a row routes to `/{network}/clpr/connectors/{channelId}/{connectorId}`.

### Pending Connectors Card

Under the table, for the selected channel: the connectors registered on that channel and not completed yet
(`status=PENDING`). Pending connectors are rows of the same connectors API, filtered by `status`.

| Commitment | Status | Created |
| --- | --- | --- |

[API] only: a pending connector has no connector id nor contract yet, and is identified by its `commitment`. Rows are not
clickable.

API: `/clpr/channels/{channelId}/connectors` (and the same endpoint with `status=PENDING` for the card), and
`/clpr/configuration` for the queue depth behind the quota.

## 4.5 Configuration Tab

### Ledger Configuration (API: `/clpr/configuration`)

Chain ID, CLPR service address, protocol version, throttles (max messages per bundle, max message payload, max gas per
message, max queue depth, max sync size, max local endpoints, max peer endpoints), initial trust anchor, and the
timestamp it is in effect since. All [API].

### Economic Configuration [CONST]

Minimum locked stake, base penalty, penalty multiplier, slash ban threshold, endpoint margin and connector queue quota.
Not provided by the mirror node (see 8.0): the card states that these values are held by the Explorer.

### Endpoint Manifest (API: `/clpr/endpoint-manifest`)

Version, in-effect-since timestamp, service address, and the list of service endpoints (`ip:port`). On Hiero the
manifest follows the list of consensus nodes.

# 5.0 Detail Pages

## 5.1 Channel Details

Route: `/{network}/clpr/channels/{channelId}`

**Header:** `Channel {id}` with the status pill and the health pill (see 9.0). The health costs one messages call, for
this channel only.

**Sub-tabs:** Summary, Messages, Connectors, Verifier & Trust.

### Summary

| Card | Content |
| --- | --- |
| Overview | Channel ID, Peer Chain ID, Status, Last Status or Anchor Change, Verifier, Verifier Fingerprint, Trust Anchor, Ownership Commitment, Created |
| Queues | Next Message ID, Acknowledged Through, Outbound Backlog [DERIVED], Received Through (peer message id) |
| Peer | Peer Explorer link [CONST], Peer Endpoint Manifest, Peer Throttles, Last Config Update, Config Acknowledged by Peer |
| Closing Progress | CLOSING or DRAINED channels only: Outbound Messages Left [DERIVED] |

"Last Status or Anchor Change" is the API `timestamp.from`: it does not move on counter-only updates, so it is not a
"last activity" time.

The Peer Endpoint Manifest and Peer Throttles are the channel's `endpoint_manifest` and `peer_throttles`: what this ledger
knows about the other side. They are distinct from this ledger's own manifest and throttles (4.5).

### Messages

The messages table of 4.2 limited to the channel, with the connector and type selectors.

### Connectors

The connectors table of 4.4 limited to the channel, without the channel selector.

### Verifier & Trust

| Card | Content |
| --- | --- |
| Verifier | Verifier Contract, Contract Name, Code Fingerprint, Admin Key |
| Trust Anchor | Anchor ID, Anchor |
| Running Hashes | Outbound running hash (after message N), inbound running hash (after peer message N) |

The verifier contract is looked up through the existing contract lookup (mirror node contract endpoint for the **admin
key**, Sourcify for the **contract name**, "None" when the contract is not verified there).

## 5.2 Connector Details

Route: `/{network}/clpr/connectors/{channelId}/{connectorId}`

**Header:** `Connector {id}` with the state pill (see 9.0).

**Sub-tabs:** Summary, Messages.

### Summary

| Card | Content |
| --- | --- |
| Overview | Connector ID, Channel (link to the channel details), Connector Contract (link), Admin Key, State [DERIVED], Created, Stake Recipient |
| Limits | Locked Stake against the minimum, Slashes against the ban threshold with the next penalty [DERIVED], In-flight Messages against the quota [DERIVED]; each with a bar |

### Messages

The messages table of 4.2 limited to the connector. No selector is shown: only DATA messages are associated with a
connector.

## 5.3 Message Details

Route: `/{network}/clpr/messages/{channelId}/{timestamp}/{messageId}`

| Card | Content |
| --- | --- |
| Message Details | Channel, Message ID, Type, Sender, Target Application, Connector, Acknowledged, Response Status, In Reply To (peer message id, only on Response messages), Size [DERIVED], Enqueued (timestamp) |
| Lifecycle | In reply to peer message N (Responses only), Enqueued on this ledger, Acknowledged by peer (or pending) |
| Payload | `message_data` as a hex dump, with its size |
| Running Hash | `running_hash`, the hash after this message |

The In Reply To value is a peer message, which is not stored on this ledger: it is not linked.

# 6 Search Bar

The search bar resolves the typed text with a set of search agents, one per kind of entity, which run in parallel and
each return candidates. Several kinds of entities may match the same input: a 32-byte hexa value is already tried
as an EVM transaction hash and as a public key, and a timestamp is already tried as a transaction timestamp.

The extension adds CLPR agents, and is limited to searches which map directly onto **one query** supported by the REST API.

## 6.1 Supported Searches

| Input                                     | Query | Result | Destination |
|-------------------------------------------| --- | --- | --- |
| 32-byte hexa value (`0x` prefix optional) | `/clpr/channels?channel.id=eq:{value}` | 0 or 1 channel | Channel details |
| Timestamp `seconds.nanoseconds`           | `/clpr/channels?timestamp=eq:{value}` | 0 or 1 channel | Channel details |

- A channel has a unique id, and a unique creation timestamp (timestamp of completion transaction), hence at most
  one result for each search.
- The channel candidate is displayed next to the existing ones. For a timestamp, the `ClprCompleteChannel` transaction candidate and the channel candidate may both be listed.
- The candidate will display the abbreviated channel id and the peer chain.
- Pending channels are not searched: they have no id, and no details page.

## 6.2 Searches Not Supported

The REST API cannot support them with a single query:

- **Connector from a single value:** connectors can only be queried within a channel. Trying a value against every
  channel would be a fan-out, which we exclude.
- **Messages from a timestamp alone, or from an integer:** messages can only be queried within a channel, and there is
  no message id filter.
- **Channels by peer chain id:** the chain id is not filterable.
- **Reverse lookups** (channels using a verifier contract, messages sent by an address, etc.): no matching API filter.

## 6.3 Possible Evolution: Combined Searches

Searches combining **two values** typed together (syntax to be defined) can also map onto a single query, and would make
connectors and messages searchable:

| Input | Query | Result | Destination                             |
| --- | --- | --- |-----------------------------------------|
| Channel ID + connector ID | `/clpr/channels/{channelId}/connectors?connector.id=eq:{connectorId}` | 0 or 1 connector | Connector details                       |
| Channel ID + timestamp | `/clpr/channels/{channelId}/connectors?timestamp=eq:{timestamp}` | 0 or 1 connector (the one created at that timestamp) | Connector details                       |
| Channel ID + timestamp | `/clpr/channels/{channelId}/messages?timestamp=eq:{timestamp}` | 0 to N messages | Specific result page with message table |

# 7.0 API Calls

| Endpoint | Used by |
| --- | --- |
| `/clpr/channels` (`status` incl. `PENDING`, `timestamp`, `limit`, `order`) | Channels tab, Overview, selectors, search by timestamp |
| `/clpr/channels?channel.id=eq:{id}` | Channel details, search by id |
| `/clpr/channels/{id}/messages` (`timestamp` required; `type`, `connector.id`) | Messages tabs, message details, channel header health |
| `/clpr/channels/{id}/connectors` (`status`, `connector.id`, `timestamp`) | Connectors tabs (including the Pending Connectors card, with `status=PENDING`), connector details |
| `/clpr/configuration` | Configuration tab, connector quota |
| `/clpr/endpoint-manifest` | Configuration tab |
| Contract lookup, Sourcify (existing) | Verifier admin key and name |

# 8.0 Static Data [CONST]

| Constant | Placeholder value | Used for |
| --- | --- | --- |
| Minimum locked stake | 1 ℏ | Low stake state, stake bars, Economic Configuration |
| Base penalty / multiplier | 0.1 ℏ / ×2 | Next penalty, Economic Configuration |
| Slash ban threshold | 5 | Near ban and Banned states, slash bars |
| Connector queue quota | 50 % of max queue depth | In-flight quota |
| Endpoint margin | 10 % | Economic Configuration (display only) |
| Channel stale threshold | 6 h | Channel health |
| Peer explorers | Chain id to explorer URL list (e.g. `eip155:1` → Etherscan) | Peer Explorer link |

The economic values and the stale threshold are not exposed by the mirror node, so the current assumptions is that
they will be held in the Explorer code or configuration.

# 9.0 Derived Data [DERIVED]

| Item | Rule | Shown in |
| --- | --- | --- |
| Outbound backlog | `next_message_id − 1 − acked_message_id` | Channels, Overview, Channel details |
| Channel health | Paused, Closing, Drained, Closed from `status`. An ACTIVE channel with a backlog is **Stale** when its oldest unacknowledged message is older than the stale threshold; otherwise Healthy | Channel header |
| Oldest unacknowledged message | Channel messages newest first, limited to the backlog size: the last one returned | Channel health |
| Connector state | `status` DELETED: Banned if slashes ≥ threshold, else Deregistered. Otherwise Near ban if slashes ≥ threshold − 1, Low stake if stake < minimum, else Healthy | Connectors, Connector header, Connector details |
| Connector quota | `⌊max_queue_depth × quota % ⌋` | Connectors, Connector details |
| Next penalty | `base penalty × multiplier^slash_count` | Connector details |
| Limit bars | Stake against 2 × minimum, slashes against the threshold, in-flight against the quota | Connectors, Connector details |
| Overview tiles and attention list | Counts and rules of 4.1, from the channels and pending lists only | Overview |
| Message size | Byte length of `message_data` | Message details |
| Stake in ℏ | `locked_stake` ÷ 10⁸ | Connector views |
| Peer explorer link | Lookup of `chain_id` in the peer explorer list | Channel details |

# 10.0 Out of Scope

Not shown, because the API cannot supply or derive it:

- Bundles, and any history: channel status history, connector history, trust anchor rotation, configuration or manifest
  history
- Connector balance and the Low balance state, connector lifetime economics
- Verifier name, kind and version, upgradeability
- Peer service address, awaiting-response counts, last bundle and last acknowledgement times
- Message direction, wire size, gas and delivery state
- The reply to a Data message sent by this ledger, and inbound Data messages (not persisted)
- Endpoint node, account and TLS certificate details
- Channels grouped by peer chain (the API cannot filter by chain)
- A "since" date for connector states (connector `timestamp.from` ignores counter updates)
- Anything aggregated across channels, which would need one request per channel: connectors at risk, stale channels, the
  health of every channel, a connector or message lookup without a channel id

# 11.0 Open Points

1. Where the connector's funded balance lives, and whether it is the ℏ balance of the connector contract. This would
   enable a Balance column and the Low balance state.
2. Whether a null `verifier_contract_id` means a built-in verifier, and whether an explicit verifier kind, name or version
   can be exposed.
3. Where the economic parameters should come from: an API, a configuration file, or Explorer constants.
4. The real channel stale rule.
5. A way to look up a message by id (or to get its timestamp) would allow message-id links, such as "Acknowledged Through". 
6. Whether the Hiero-internal ClprEndpointPublication can surface in the REST API.
7. A cross-channel connector listing or lookup (the preliminary OpenAPI had `/clpr/connectors` with an optional channel).
   This would enable to Search connectors by ID or timestamp, and to list connectors needing attention/at risk.
8. Whether the connectors list of a channel, without a `status` filter, includes the pending connectors. The Explorer
   assumes it does not, as for channels, and requests them with `status=PENDING`.
