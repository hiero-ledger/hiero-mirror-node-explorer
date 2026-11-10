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
  - found through `GET /clpr/channels?timestamp=eq:{timestamp}` which returns at most one channel
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
- Rows without a destination are not clickable (e.g. pending channels, which have no channel id yet). 
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
| Paused or stale | Count, with the paused and stale split | [DERIVED] health |
| Outbound backlog | Sum of channel backlogs | [DERIVED] |
| Connectors at risk | Near ban, Banned or Low stake, out of all connectors | [DERIVED] connector state |
| Pending registrations | Pending channels + pending connectors | [API] counts |

### Channel Status Table

| Channel | Peer Chain | Status | Backlog | Health |
| --- | --- | --- | --- | --- |

A click on a row routes to the channel details.

### Needs Attention

| What | Where | Detail | Since |
| --- | --- | --- | --- |

[DERIVED] list, built from:

- Paused channels
- Stale channels
- Connectors one slash from the ban threshold, or below the minimum stake
- Pending channel registrations committed more than 24 hours ago

A click on a row routes to the channel or connector details when there is one. The Since column is shown only where the
API gives a reliable date (not for connector states, see 9.0).

API: channels, connectors of every channel, messages of stale-candidate channels, pending connectors.

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

API: `GET /clpr/channels/{channelId}/messages` (`type`, `connector.id`, `timestamp`, `limit`, `order`). The API requires a
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

API: `GET /clpr/channels` (`status`, `timestamp`, `limit`, `order`). Peer chain is not filterable.

## 4.4 Connectors Tab

Header controls: `CHANNEL:` selector, state selector (`STATES: ALL`).

### Table Columns

| Connector ID | Contract | Locked Stake | In-flight | Slashes | State | Created |
| --- | --- | --- | --- | --- | --- | --- |

### Column Definitions

- **Connector ID / Contract** – `connector_id`, `connector_contract_id`
- **Locked Stake** – `locked_stake` (tinybars, shown in ℏ), against the minimum stake [CONST], with a bar
- **In-flight** – `in_flight_message_count`, against the connector quota [DERIVED], with a bar
- **Slashes** – `slash_count`, against the ban threshold [CONST], with a bar
- **State** – [DERIVED] Healthy, Low stake, Near ban, Banned or Deregistered
- **Created** – `created_timestamp`

Clicking a row routes to `/{network}/clpr/connectors/{channelId}/{connectorId}`.

### Pending Connectors Card

| Commitment | Status | Created |
| --- | --- | --- |

[API] only: the channel, connector id, submitter and stake are not known before a commitment is revealed. Rows are not
clickable.

API: `GET /clpr/channels/{channelId}/connectors`, `GET /clpr/connectors/pending`, and `GET /clpr/configuration` for the
queue depth behind the quota.

## 4.5 Configuration Tab

### Ledger Configuration (API: `GET /clpr/configuration`)

Chain ID, CLPR service address, protocol version, throttles (max messages per bundle, max message payload, max gas per
message, max queue depth, max sync size, max local endpoints, max peer endpoints), initial trust anchor, and the
timestamp it is in effect since. All [API].

### Economic Configuration [CONST]

Minimum locked stake, base penalty, penalty multiplier, slash ban threshold, endpoint margin and connector queue quota.
Not provided by the mirror node (see 7.0): the card states that these values are held by the Explorer.

### Endpoint Manifest (API: `GET /clpr/endpoint-manifest`)

Version, in-effect-since timestamp, service address, and the list of service endpoints (`ip:port`). On Hiero the
manifest follows the consensus roster.

On extra large screens, the Ledger Configuration and Economic Configuration cards are displayed side by side.

# 5.0 Detail Pages

On extra large screens, the first cards of the detail pages are placed side by side, as noted below.

## 5.1 Channel Details

Route: `/{network}/clpr/channels/{channelId}`

**Header:** `Channel {id}` with the status pill and the health pill (see 8.0).

**Sub-tabs:** Summary, Messages, Connectors, Verifier & Trust.

### Summary

| Card | Content |
| --- | --- |
| Overview | Channel ID, Peer Chain ID, Status, Last Status or Anchor Change, Verifier, Verifier Fingerprint, Trust Anchor, Ownership Commitment, Created |
| Queues | Next Message ID, Acknowledged Through, Outbound Backlog [DERIVED], Received Through (peer message id) |
| Peer | Peer Explorer link [CONST], Peer Endpoint Manifest, Peer Throttles, Last Config Update, Config Acknowledged by Peer |
| Closing Progress | CLOSING or DRAINED channels only: Outbound Messages Left [DERIVED] |

Queues and Peer are displayed side by side on extra large screens.

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

**Header:** `Connector {id}` with the state pill (see 8.0).

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

# 6.0 API Calls

| Endpoint | Used by |
| --- | --- |
| `GET /clpr/channels` (`status`, `timestamp`, `limit`, `order`) | Channels tab, Overview, selectors |
| `GET /clpr/channels?channel.id=eq:{id}` | Channel details |
| `GET /clpr/channels/{id}/messages` (`timestamp` required; `type`, `connector.id`) | Messages tabs, message details, health |
| `GET /clpr/channels/{id}/connectors` (`connector.id`) | Connectors tabs, connector details, Overview |
| `GET /clpr/connectors/pending` | Pending Connectors card, Overview |
| `GET /clpr/configuration` | Configuration tab, connector quota |
| `GET /clpr/endpoint-manifest` | Configuration tab |
| Contract lookup, Sourcify (existing) | Verifier admin key and name |

**Costs to keep in mind**:

- The connectors API is per channel: the Overview (connectors at risk, attention list) needs one call per channel.
- Channel health needs one messages call per ACTIVE channel with a backlog.
- The messages API requires a timestamp range, and has no id lookup.

# 7.0 Static Data [CONST]

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

# 8.0 Derived Data [DERIVED]

| Item | Rule | Shown in |
| --- | --- | --- |
| Outbound backlog | `next_message_id − 1 − acked_message_id` | Channels, Overview, Channel details |
| Channel health | Paused, Closing, Drained, Closed from `status`. An ACTIVE channel with a backlog is **Stale** when its oldest unacknowledged message is older than the stale threshold; otherwise Healthy | Overview, Channel header |
| Oldest unacknowledged message | Channel messages newest first, limited to the backlog size: the last one returned | Health, Attention |
| Connector state | `deleted`: Banned if slashes ≥ threshold, else Deregistered. Otherwise Near ban if slashes ≥ threshold − 1, Low stake if stake < minimum, else Healthy | Connectors, Connector header, Overview |
| Connector quota | `⌊max_queue_depth × quota % ⌋` | Connectors, Connector details |
| Next penalty | `base penalty × multiplier^slash_count` | Connector details |
| Limit bars | Stake against 2 × minimum, slashes against the threshold, in-flight against the quota | Connectors, Connector details |
| Overview tiles and attention list | Counts and rules of 4.1 | Overview |
| Message size | Byte length of `message_data` | Message details |
| Stake in ℏ | `locked_stake` ÷ 10⁸ | Connector views |
| Peer explorer link | Lookup of `chain_id` in the peer explorer list | Channel details |

# 9.0 Out of Scope

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

# 10.0 Open Points

1. Where the connector's funded balance lives, and whether it is the ℏ balance of the connector contract. This would
   enable a Balance column and the Low balance state.
2. Whether a null `verifier_contract_id` means a built-in verifier, and whether an explicit verifier kind, name or version
   can be exposed.
3. Where the economic parameters should come from: an API, a configuration file, or Explorer constants.
4. The real channel stale rule.
5. A way to look up a message by id (or to get its timestamp) would allow message-id links, such as "Acknowledged Through". 
6. Whether the Hiero-internal ClprEndpointPublication can surface in the REST API.