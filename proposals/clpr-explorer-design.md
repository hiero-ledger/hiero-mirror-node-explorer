# CLPR Support in Mirror Node Explorer

# 1.0 Objective

Enhance the Hiero Mirror Node Explorer to support CLPR (Cross Ledger Protocol), covering:

- **Overview** — Network Health and Ecosystem: search for any message, connector or channel first, then which networks this ledger is connected to, how healthy those connections are, and how much traffic they carry
- **Channels** — cross-ledger communication paths to a peer ledger, grouped All / By Chain / Pending, each with its messages, connectors and verifier
- **Configuration** — this ledger's own CLPR configuration and the endpoint manifest
- **CLPR transaction types**, surfaced on the site-wide Transactions page

Scope follows the final mirror node design, `docs/design/clpr.md` in `hiero-mirror-node` (`main` @ `0c0a831342`, [PR #14653](https://github.com/hiero-ledger/hiero-mirror-node/pull/14653), merged 2026-11-11). That design exposes five REST read endpoints, all under `/api/v1/clpr`, and nothing else. Every table, card and field below is backed by one of them or by an existing mirror node API (accounts, contracts, transactions). Anything the five endpoints cannot supply has been removed, so it is not part of this design.

A clickable mockup of every page, using invented data, is in [clpr-explorer-mockup-v3.html](clpr-explorer-mockup-v3.html). Open it in a browser.

| Endpoint | Returns |
| --- | --- |
| `GET /channels` | Channels, including not-yet-completed registrations (`status=PENDING`). Filters: `channel.id` (exact), `status`, `timestamp`. With `channel.id`, `timestamp` returns that Channel's state as of a past time. |
| `GET /channels/{channelId}/messages` | A Channel's messages. `timestamp` is required. Filters: `type`, `connector.id`. |
| `GET /channels/{channelId}/connectors` | A Channel's Connectors, including pending ones. Filters: `connector.id`, `status`, `timestamp`. With `connector.id`, `timestamp` returns that Connector's state as of a past time. |
| `GET /configuration` | This ledger's current CLPR configuration (a single object), or the one in effect at a past time. |
| `GET /endpoint-manifest` | This ledger's current endpoint manifest (a single object), or the one in effect at a past time. |

## 1.2 User Stories

### Key Personas

Three core personas drive this design:

- **Message senders & receivers.** Their recurring question is "what happened to my message?" — not "tell me about this Channel." They want to know whether it was queued and acknowledged, and whether the Channel they're relying on is even up right now.
- **Channel & Connector operators.** Their question spans setting up the link and keeping it solvent: which verifier a Channel trusts, whether its lifecycle is moving as expected, and whether each Connector's locked stake, slash count and spendable balance are healthy. Registering a Channel and a Connector on it are usually the same actor's two halves, so they are one persona.
- **Ledger administrators.** On Hiero every consensus node is a CLPR Endpoint, so there is no separate endpoint-operator audience. Their question: is the whole system healthy (this ledger's configuration, every Channel's state, whether the endpoint manifest is current).

Each list is split into **Must have** (the design doesn't hold together without it) and **Nice to have** (the design works if it slips). Story numbers are not contiguous. Every story is supported by the final mirror node design, with the limits noted.

### 1.0 User Stories: Message Senders & Receivers

#### Must Have

1.1 As a user who just sent a message, I want to see whether it is queued or acknowledged by the peer, so I know whether to wait or escalate without polling my own application's logs. *(3.2 Messages sub-tab, Acknowledged column; 3.4, Message detail page)*  
**Mirror node: supported for queued and acknowledged.** This ledger does not record the reply to its own outbound message, so a "responded" state is not shown.

1.2 As a user whose application receives CLPR messages, I want to see when an inbound message was dispatched to my target application and how it turned out, so I know it actually arrived. *(3.2 Messages sub-tab; 3.4, Message detail page)*  
**Mirror node: supported through the reply only.** The consensus node does not store an inbound Data message. It stores the Response this ledger generates for it, which records the status (`SUCCESS`, `APPLICATION_ERROR`, `CONNECTOR_NOT_FOUND`, `CONNECTOR_UNDERFUNDED`), the reply data, the peer's message ID it answers and the dispatch time. The inbound payload, sender and target application are not available.

1.4 As a user, I want to see at a glance whether the Channel I'm sending through is `ACTIVE`, `PAUSED` or closing, and how many of my Channel's messages the peer has not yet acknowledged, so I know whether to expect my messages to go through. *(2.2.1, Needs attention list; 3.2, Summary)*  
**Mirror node: supported.** Status and the queue counters are direct Channel fields.

1.12 As a user who only has the transaction ID of my application's `sendMessage` call, I want to land on the CLPR message or messages it sent, so I can follow my message without knowing the channel or message ID. *(2.2.1, search; 4.2; 4.3)*  
**Mirror node: not supported directly; supported by a client-side workaround.** Messages are stored and queried by Channel and consensus timestamp only (the Messages endpoint requires both, and `clpr_message` has no transaction ID column). The explorer reads the transaction's consensus timestamp from the transactions API, then queries every Channel's messages with `timestamp=eq:` and keeps the matches. This works because an outbound Data message is written in the same transaction as the `sendMessage` call, so its row carries that transaction's timestamp (confirmed 2026-11-17 against the importer in open PR #14626). Limits: outbound Data messages only; one query per Channel; and it needs message ingestion, which is not on mirror node `main` yet (6.0). Search (4.3) has the mechanics; a direct lookup is on the asks list (6.1).

1.13 As a user whose message has not been acknowledged, I want to be told in plain words where it stopped and who has to act next, so I do not have to interpret queue counters. *(3.4, outcome banner)*  
**Mirror node: supported (derived).** The banner combines the message's acknowledged state, the Channel's status and the age of the oldest unacknowledged message. For an inbound message's Response it translates the reply status into the party that needs to act.

1.14 As a user who has a Connector ID (from an application's configuration or from another party), I want to find that Connector and see its Channel, stake and slash count, so I can check it before I rely on it. *(2.2.1, search; 3.3; 4.3)*  
**Mirror node: supported through a fan-out.** The Connectors endpoint requires a Channel, so the explorer asks each Channel for `connector.id=eq:` until one answers. A Connector ID is derived from its Channel ID, so it is unique across Channels and the first hit is the only one.

#### Nice to Have

1.9 As a user tracking many messages on one Channel, I want to filter by type, by connector and by acknowledged state, so I can find the one message that failed or is still waiting without paging past hundreds that succeeded. *(3.2 Messages sub-tab, filters)*  
**Mirror node: supported for type and connector.** Only those two are filterable on the server. The acknowledged filter is applied in the browser, on the `acknowledged` field the API returns.

1.10 As a user, I want a link from my message to its journey on the peer ledger, so I can see delivery and execution on the other side. *(3.4)*  
**Mirror node: supported.** Built by the explorer from the Channel's peer chain ID and the message ID; no mirror node data beyond those two fields is needed.

1.11 As a user whose message was handled by a Connector, I want to jump from the message to that connector's page, which shows its slash count, so I can judge whether it has a history of running dry. *(3.2 Messages sub-tab → 3.3, Limits card)*  
**Mirror node: supported for Data messages**, the only rows that carry a connector ID.

### 2.0 User Stories: Channel & Connector Operators

#### Must Have

2.1 As an integrator about to register a new Channel, I want to see whether the verifier it will trust sits behind an upgradeable proxy and who holds the upgrade key, so I can judge that trust before I commit. *(3.2, Verifier & Trust sub-tab)*  
**Mirror node: supported** when the verifier is a contract: the Channel returns the verifier's contract ID and code fingerprint, and the explorer reads upgradeability and admin key from the existing contract APIs.

2.2 As a Channel operator who just submitted a registration commitment, I want to confirm it landed before I submit the reveal transaction, so I'm not guessing whether to retry a possibly-already-accepted commit. *(2.2.2, Pending sub-tab)*  
**Mirror node: supported.**

2.5 As a Connector operator trying to deregister, I want to see my in-flight message count and which messages are still unacknowledged, so I know why `ClprDeregisterConnectorTransaction` keeps failing. *(3.3, Limits card)*  
**Mirror node: supported.** The count is a Connector field. A link beside it opens the Connector's Messages sub-tab filtered to unacknowledged messages.

2.6 As a Connector operator, I want my locked stake, slash count and spendable balance visible next to my recent message volume, so I can top up before a `CONNECTOR_UNDERFUNDED` reply costs me a slash. *(3.3, Limits card; Messages sub-tab)*  
**Mirror node: supported.** Spendable balance is the connector contract's own balance from the existing accounts API. Recent volume is the number of the Connector's Data messages in the last 7 days, counted by the explorer from the Channel's messages filtered by connector.

2.7 As a Connector operator, I want to see that my connector was banned, and when, so I am not left with a plain "not found." *(3.3, banned connectors)*  
**Mirror node: supported.** The ledger deletes a banned connector's record, but the mirror node keeps it as a soft-deleted row (`status=DELETED`). A ban is a deleted row with no stake recipient; a voluntary deregistration records one.

#### Nice to Have

2.8 As a Channel operator with a Channel that's `CLOSING` or `DRAINED`, I want to see how many messages are left to be acknowledged, so I know roughly when it will finish closing. *(3.2, Closing Progress card)*  
**Mirror node: supported** from the Channel's queue counters.

2.9 As a Channel operator, I want to see how many Connectors and how much unacknowledged traffic my Channel carries. *(3.2, Summary and Connectors sub-tab)*  
**Mirror node: supported.**

### 3.0 User Stories: Ledger Administrators

#### Must Have

3.1 As a ledger administrator, I want to see this ledger's current CLPR configuration, and the configuration in effect at a past time, so I know what limits peers and applications are working under. *(2.2.3, Ledger Configuration)*  
**Mirror node: supported.**

3.2 As a ledger administrator, I want an aggregate view of every Channel's status and backlog, so I can spot systemic trouble without clicking through each one. *(2.2.1, Overview tab)*  
**Mirror node: supported at Channel level.** Connector state is per Channel, so it is not aggregated across Channels.

3.9 As a ledger administrator, or anyone assessing CLPR on this network, I want to see which networks this ledger is connected to and how much cross-ledger traffic they carry, so I can judge how large the ecosystem is. *(2.2.1, Connected networks and Ecosystem at a glance)*  
**Mirror node: supported for cumulative totals only.** Networks come from the peer chain IDs on the Channels listing (claimed, not verified: 5.2). Message totals are sums of the Channel counters (`next_message_id`, `received_message_id`). Trends over time and Connector totals are not available: there is no ledger-wide Messages or Connectors source and no aggregate endpoint (asks, 6.1).

3.10 As a ledger administrator, I want the Overview to point me at the networks and Channels that need attention first, so I can act without scanning every Channel. *(2.2.1, Network health)*  
**Mirror node: supported.** Status, the counters and this ledger's `max_queue_depth` (Configuration endpoint) are enough to flag paused, closing and nearly full Channels.

3.3 As a ledger administrator, I want to confirm the endpoint manifest is current, so I know which endpoints peers are being told to use. *(2.2.3, Endpoint Manifest)*  
**Mirror node: supported.** The manifest's version and endpoint addresses are returned, and a past manifest can be looked up by time.

#### Nice to Have

3.8 As a consensus node operator, I want this ledger's current throttles (max bundle size, max messages per bundle, max sync bytes and the rest) in one place, so I can size my relay infrastructure correctly. *(2.2.3)*  
**Mirror node: supported.** Economic parameters are not in CLPR state and are not shown.

# 2.0 Explorer Structure & Tables

## 2.1 Top-Level Navigation

Add a **CLPR** tab to the tab bar, after Topics:

```
Home · Transactions · Tokens · Topics · CLPR · Contracts · Accounts · Network · Staking · Blocks · Metrics
```

CLPR has three tabs. Only Channels keeps sub-tabs:

```
CLPR
├── Overview        (default)
├── Channels
│     ├── All          (default)
│     ├── By Chain
│     └── Pending
└── Configuration
```

Design principle:

- Tables = lightweight, discoverable
- Detail pages = state and configuration
- Default to the question that sends users to CLPR: **Overview** opens with search, because the most common visit is "find my message, connector or channel", and then answers "is the ecosystem healthy?": which networks are connected, how much traffic they carry and what needs attention. Per-Channel detail stays one click away.
- Messages and Connectors live under their Channel. The mirror node design scopes both to a Channel by design (`channelId` is a required path parameter), so there is no ledger-wide Messages or Connectors tab.

A Channel can be reached from the Overview (search or Needs attention list), from Channels → All or By Chain, or from search anywhere in the explorer (4.3).

## 2.2 Table Views

### 2.2.1 Overview Tab: Network Health and Ecosystem

Route: `/:network/clpr` (default)

**Header Content:** Cross Ledger Protocol on this network: which networks it is connected to, how healthy those connections are, and how much traffic they carry.

The page has four blocks, in this order.

**1. Search** (first, and the primary purpose of the page). One wide box, "Search a message, connector or channel". It accepts the inputs in 4.3, works out which one it was given, and shows results grouped by type (Messages, Connectors, Channels, Networks), each linking to its detail page (3.4, 3.3, 3.2, 3.1). If nothing is found, the box says what was checked and, for a transaction ID, why it may not match: not a `sendMessage` call, no Data message sent, or older than the 30-day messages window.

**2. Ecosystem at a glance.** A stat row computed by the explorer over the Channels listing:

| Stat | Example | Source |
| --- | --- | --- |
| Connected networks | 3 | Distinct peer chain IDs with at least one `ACTIVE` Channel (claimed, see below) |
| Channels | 8 / 11 active / total | Channel `status` |
| Messages sent | 12,480 | Sum of `next_message_id` − 1 over all Channels. Counts every message this ledger queued: Data, Responses and Control |
| Messages received | 11,902 | Sum of `received_message_id`: the peer's messages this ledger has processed |

These are all-time totals across every Channel, including closed ones, because the counters persist. They are not rates: the mirror node has no endpoint for activity over time (asks, 6.1). Minor counts, such as messages awaiting acknowledgement and pending registrations, are deliberately left off; a Channel's backlog appears under Network health (block 4), and pending registrations under Channels → Pending.

**3. Connected networks.** One card or row per peer chain ID, busiest first (messages sent plus received):

| Network | Channels (active / total) | Status mix | Messages sent / received |
| --- | --- | --- | --- |
| Ethereum Sepolia (`eip155:11155111`) | 2 / 3 | 2 active, 1 paused | 1,240 / 1,198 |

- **Name and link** come from the curated chain allow-list that By Chain already uses (2.2.2). A chain with no entry shows its raw ID.
- **Caveat, shown on the block:** networks are shown as claimed, not verified (5.2).
- Clicking a row opens the Peer Chain page (3.1). "View all networks" opens By Chain.
- **Not shown in v1:** last message time and Connector counts per network; both need per-Channel queries (6.1).

**4. Network health.**

- **Channel status:** a stacked bar of Active, Paused, Closing, Drained and Closed counts.
- **Needs attention:** Channels that are Paused, Closing or Drained, or whose backlog is at least 80% of this ledger's `max_queue_depth` (from the Configuration endpoint; 80% is a display choice, not a protocol value). At most 10 rows, worst first (Paused, Closing, Drained, then by backlog), with "View all Channels". If there are none, it says "No Channel needs attention."

| Channel | Peer Chain | Status | Backlog | Status Since |
| --- | --- | --- | --- | --- |
| 0x1a2b…3c4d | eip155:1 | PAUSED | 4 | 2026-09-28 |

  - **Backlog** = `next_message_id` − 1 − `acked_message_id`: messages sent from this ledger that the peer hasn't acknowledged yet.
  - **Status Since** is the start of the Channel's current record version. Counter-only updates (queue positions, running hashes) do not start a new version, so for a `PAUSED` or `CLOSING` Channel this is when it entered that status.
- **This ledger's CLPR state:** two lines, one read each, linking to the Configuration tab (2.2.3): the configuration in effect (since when, and its max queue depth) and the endpoint manifest (version, endpoint count, last updated).

**Cost.** One pass over the Channels listing (`limit=100` per page) plus two single reads. The explorer stops after 20 pages (2,000 Channels) and labels the totals "partial" if there are more; the cap is a client choice and can be raised.

### 2.2.2 Channels Tab

Route: `/:network/clpr/channels`, sub-tabs **All · By Chain · Pending**.

#### All *(default)*

**Header Content:** Every channel registered on this ledger. Peer chains are claimed, not verified (5.2).

| Channel ID | Peer Chain | Status | Verifier Contract | Backlog | Created |
| --- | --- | --- | --- | --- | --- |
| 0x1a2b…3c4d | eip155:1 | ACTIVE | 0.0.456 | 4 | 2026-09-20 |

- **Filters:** Status (server-side). Peer chain is filtered client-side.
- **Verifier Contract** links to the contract page. A Channel with no verifier contract recorded shows a dash; the mirror node stores no name or version for a built-in verifier.
- **Source:** `GET /api/v1/clpr/channels`, paged with `limit=100`. `chain_id` is returned on every Channel but is **not filterable server-side**, so everything that groups or filters by peer chain works client-side over the full listing.

#### By Chain

Channels grouped by the peer chain they claim to connect to (CAIP-2 chain IDs), grouped client-side from the Channels listing.

| Peer Chain ID | Channels | Active | Peer Explorer |
| --- | --- | --- | --- |
| eip155:1 | 3 | 1 | etherscan.io |

Peer explorer links are a curated allow-list the explorer itself maintains, keyed by chain ID — convenience, not protocol data. A chain with no entry simply shows none.

Clicking a row routes to the Peer Chain page (3.1).

#### Pending

**Header Content:** Registrations that are committed on this ledger but not yet complete.

**Pending Channel Registrations**

| Ownership Commitment | Committed | Age |
| --- | --- | --- |
| 0xcc44…8801 | 2026-10-02 07:40 | 1 d |

A channel's ID stays secret until its registration is completed, so each entry shows only the commitment and when it was committed. Rows are not clickable; there is no detail page.

**Source:** `GET /api/v1/clpr/channels?status=eq:PENDING`. Pending rows carry only a commitment, a creation time and a status.

Pending Connector registrations are shown per Channel, on the Connectors sub-tab (3.2), because the Connectors endpoint is scoped to a Channel.

### 2.2.3 Configuration Tab

Route: `/:network/clpr/configuration`

**Header Content:** This ledger's CLPR configuration as peers see it, and the endpoints peers deliver bundles through.

**Ledger Configuration**

| Field | Value |
| --- | --- |
| Chain ID | hedera:mainnet |
| CLPR Service Address | 0x…016e |
| Protocol Version | 1 |
| Max Messages per Bundle | 1,000 |
| Max Message Payload | 64 KB |
| Max Gas per Message | 15,000,000 |
| Max Queue Depth | 10,000 |
| Max Sync Size | 4 MB |
| Max Local Endpoints | 39 |
| Max Peer Endpoints | 39 |
| Initial Trust Anchor | 0x3344… *(ID 0x9f8e…)* |
| Last Updated | 2026-10-03 08:30 |

**Source:** `GET /api/v1/clpr/configuration`. It returns one object, the latest. A **View as of** control passes `timestamp=lte:<time>` to show the configuration in effect at a past time. There is no list of past configurations.

**Endpoint Manifest**

| Field | Value |
| --- | --- |
| Version | 7 |
| Last Updated | 2026-09-29 00:00 |

| Service Endpoint |
| --- |
| 52.14.88.201:50212 |

On Hiero, every consensus node is a CLPR endpoint, so this manifest follows the consensus roster. The mirror node returns each endpoint's address and port only: no node ID, account or certificate, so the explorer does not link rows to node pages.

**Source:** `GET /api/v1/clpr/endpoint-manifest`, the latest manifest, with the same **View as of** control. There is no manifest history list.

# 3.0 Detail Pages

## 3.1 Peer Chain Page

Route: `/:network/clpr/chain/{chainId}`

**Header Content:** the chain ID, with the same caveat as By Chain (2.2.2).

| Channel ID | Status | Verifier Contract | Backlog | Created |
| --- | --- | --- | --- | --- |
| 0x1a2b…3c4d | ACTIVE | 0.0.456 | 4 | 2026-09-20 14:05 |

- **Status filter:** All, Active, Paused, Closing, Drained, Closed.
- **Source:** the Channels listing filtered client-side by `chain_id` (2.2.2). The mirror node has no per-chain endpoint.

Clicking a row routes to `/:network/clpr/channel/{channelId}`.

## 3.2 Channel Detail Page

Route: `/:network/clpr/channel/{channelId}`, with sub-tabs **Summary · Messages · Connectors · Verifier & Trust**.

Breadcrumb: Channels › {peer chain} › Channel.

**Source:** `GET /api/v1/clpr/channels?channel.id=eq:{channelId}`. A **View as of** control passes `timestamp=eq:<time>` and shows the Channel's state at that time (status, queue counters, trust anchor), which is how a past status or trust anchor is inspected. There is no list of past versions.

### Summary

**Overview card**

| Field | Value |
| --- | --- |
| Channel ID | 0x1a2b…3c4d |
| Peer Chain ID | eip155:1 *(links to the Peer Chain page)* |
| Status | ACTIVE *(since 2026-09-28 08:15)* |
| Verifier Contract | 0.0.456 *(links to the contract page)* |
| Trust Anchor | 0x77aa…bbcc |
| Created | 2026-09-20 14:05 |

**Queues card**

| Field | Value |
| --- | --- |
| Next Message ID | 1,245 |
| Acknowledged Through | 1,240 |
| Outbound Backlog | 4 |
| Received Through | 998 |

- **Outbound Backlog** = Next Message ID − 1 − Acknowledged Through. A backlog that keeps growing while the Channel is `ACTIVE` suggests the peer has stopped acknowledging.

**Peer card**

| Field | Value |
| --- | --- |
| Peer Throttles | 500 msgs/bundle · 32 KB payload · 3,000,000 gas · queue depth 1,000 · 4 MB sync |
| Peer Endpoint Manifest | v4 · 2 endpoints |

What this ledger knows about the other side: the limits the peer asked us to respect when sending, and its endpoints (address and port) with the manifest version. Peer throttles are empty until the peer's first configuration update arrives; the card then shows "not yet received". The peer's service address is not recorded, so the explorer's peer link is built from the chain ID alone (3.4).

**Closing Progress card** *(shown only when Status is `CLOSING` or `DRAINED`)*

| Field | Value |
| --- | --- |
| Status Since | 2026-10-02 06:00 |
| Outbound Messages Left | 3 |

A closing channel accepts no new messages and waits for every outstanding message and response to be delivered. It becomes `DRAINED` when both sides are empty, then `CLOSED`.

### Messages Sub-Tab

**Header Content:** This ledger's outbound queue for the Channel, newest first: Data messages its applications sent, the Responses it generated for inbound Data (one per inbound message dispatched here), and Control messages. Inbound Data messages themselves are not stored by the consensus node, so they do not appear; the Response for each one does.

| ID | Type | Sender | Target | Connector | Reply Status | Replies To | Acknowledged | Size | Time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1244 | DATA | 0.0.2101 | 0x7788…1a1a | 0x4d5e…6f70 | — | — | No | 112 B | 24 h ago |
| 1245 | RESPONSE | — | — | — | CONNECTOR_UNDERFUNDED | peer msg 998 | Yes | 0 B | 30 min ago |

- **Filters:** Type (Data / Response / Control), Connector, Acknowledged (All / Not acknowledged / Acknowledged). Connector only ever matches Data messages: Response and Control rows carry no connector. The Acknowledged filter runs in the browser over the loaded window.
- **Reply Status** is the status on a Response message (`SUCCESS`, `APPLICATION_ERROR`, `CONNECTOR_NOT_FOUND`, `CONNECTOR_UNDERFUNDED`). **Replies To** is the peer's message ID the Response answers, which is how an inbound message's outcome is shown (1.2).
- **Acknowledged** is computed by the mirror node: the message ID is at or below the Channel's acknowledged-through counter. Every row here comes from this ledger's own queue, so it is one ID space and the comparison is valid for all of them.
- **Connector** cell links to the Connector detail page (3.3). It is blank for Response and Control rows.
- **Size** is the payload length in bytes.
- **Message IDs count per Channel**, so an ID is only meaningful next to its Channel.
- **Time window.** The mirror node requires a `timestamp` bound on every messages query, limited to a maximum window. The tab opens on the most recent window the server allows and offers **Load older** to move the window back. Messages that arrived in the same bundle share one timestamp, so a page boundary that lands inside such a group can skip or repeat rows.
- Each row opens the Message detail page (3.4); there is no expand row.

**Source:** `GET /api/v1/clpr/channels/{channelId}/messages`.

### Connectors Sub-Tab

| Connector ID | Contract | Locked Stake | Balance | In-flight | Slashes | State | Created |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0x4d5e…6f70 | 0.0.789 | 1 ℏ | 25.4 ℏ | 2 | 0 | Active | 2026-09-20 15:20 |

- **Filters:** Status (Active default, Pending, Deleted).
- **State** is Pending (registered, not yet completed), Active, Banned (deleted, no stake recipient) or Deregistered (deleted, with a stake recipient). It is read directly from the Connector record.
- **Balance** is the connector contract's balance from the existing accounts API.
- **Pending** rows have no connector ID or contract yet; they show only the commitment and when it was registered.
- The mirror node does not publish the minimum stake, ban threshold or in-flight quota, so none of these columns is shown against a limit.
- Clicking a row routes to the Connector detail page (3.3).

**Source:** `GET /api/v1/clpr/channels/{channelId}/connectors`.

### Verifier & Trust Sub-Tab

**Verifier card** *(the verifier on this ledger)*

| Field | Value |
| --- | --- |
| Verifier Contract | 0.0.456 *(links to the contract page)* |
| Code Fingerprint | 0x55aa…bb |
| Upgradeability | Proxy: upgradeable *(from the contract page)* |
| Admin Key | 0x302a… |

A verifier is fixed for the life of a channel. The mirror node stores its contract, fingerprint and the current trust anchor; upgradeability and admin key come from the existing contract APIs. They are facts for vetting the channel, not a verdict. When no verifier contract is recorded the card shows only the fingerprint.

**Paired Network card**

| Field | Value |
| --- | --- |
| Paired Network | eip155:1 *(links to the Peer Chain page; peer of hedera:mainnet)* |
| Peer Explorer | etherscan.io *(from the curated allow-list, 2.2.2)* |
| Peer Verifier Contract | not recorded on this ledger |

The other end of the Channel. The chain ID is chosen by the Channel's creator, so it is not evidence that the peer is genuine (5.2). The mirror node stores only this ledger's verifier. The peer's verifier contract and service address live on the peer ledger and are not recorded here, so the explorer shows the paired network and a link to its explorer, not the peer verifier. Showing it would need the consensus node and mirror node to record it; reading it from the peer ledger would be unverifiable.

**Trust Anchor card**

| Field | Value |
| --- | --- |
| Trust Anchor | 0x77aa…bbcc |
| Trust Anchor ID | 0x9f8e…7a61 |

The trust anchor is the verifier's current reference point on the peer (a validator set, a sync-committee period, a block header). Only the current value is shown here. To see an earlier one, use **View as of** at the top of the Channel page.

**Running Hashes card**

| Field | Value |
| --- | --- |
| Outbound Running Hash | 0x6f1a…e02c |
| Inbound Running Hash | 0x3b77…c1d9 |

Each queue keeps a running hash: SHA-256 of the previous hash and the newest message. Both sides must agree on these for a bundle to be accepted.

## 3.3 Connector Detail Page

Route: `/:network/clpr/channel/{channelId}/connector/{connectorId}`, with sub-tabs **Summary · Messages**. Nested under its Channel because the mirror node resolves a Connector only within a Channel.

Breadcrumb: Channels › {Channel} › Connector.

**Source:** `GET /api/v1/clpr/channels/{channelId}/connectors?connector.id=eq:{connectorId}`, with the same **View as of** control as the Channel page.

### Summary

**Overview card**

| Field | Value |
| --- | --- |
| Connector ID | 0x88aa…22bb |
| Channel | 0x1a2b…3c4d *(links to the Channel page)* |
| Connector Contract | 0.0.790 *(links to the contract page)* |
| Admin Key | 0x302a… |
| State | Active |
| Created | 2026-09-10 10:00 |
| Last Changed | 2026-10-02 11:02 |

**Banned and deregistered connectors** (story 2.7): the page renders from the mirror node's soft-deleted row. State shows **Banned** when no stake recipient was recorded, or **Deregistered** when one was. The ban time is the row's last-changed time, and the bundle that caused it is the CLPR Submit Bundle transaction at that timestamp.

**Limits card**

| Field | Value |
| --- | --- |
| Locked Stake | 0.2 ℏ |
| Spendable Balance | 1.1 ℏ |
| Slashes | 4 |
| In-flight Messages | 2 *(link: show the unacknowledged messages)* |
| Messages, last 7 days | 2 |

Spendable balance is the leading indicator of `CONNECTOR_UNDERFUNDED`; in-flight messages block a clean deregistration, and the link beside the count opens the Messages sub-tab filtered to unacknowledged messages. The 7-day message count is computed by the explorer from the Channel's messages. These are current values only: the mirror node does not publish the thresholds they would be compared with.

### Messages Sub-Tab

The Channel's Messages sub-tab (3.2), pre-filtered to this Connector, with an Acknowledged filter. Only Data messages carry a connector, so this lists the messages it authorized or was charged for.

## 3.4 Message Detail Page

Route: `/:network/clpr/channel/{channelId}/message/{consensusTimestamp}/{messageId}`

The mirror node has no way to look up a single message by ID, so the route carries the message's consensus timestamp. The page loads the Channel's messages with `timestamp=eq:<consensusTimestamp>` (at most one bundle's worth) and picks the message by ID.

**Outcome banner** (top of the page, story 1.13): one plain-language line on where the message stands and who acts next. Data message acknowledged: "Acknowledged". Not acknowledged: "Queued, waiting for the peer" with the age of the channel's oldest unacknowledged message, or "Waiting: channel PAUSED since …" (or closing or drained). Response message: "Delivered", or the failure with the party who must act (`APPLICATION_ERROR`: the application; `CONNECTOR_UNDERFUNDED`: the connector operator; `CONNECTOR_NOT_FOUND`: the peer-side sender). Control message: informational.

**Overview card:** Channel (link), Message ID, Type, Sender, Target Application, Connector (link, Data messages only), **Sent By Transaction** (link to the transaction, Data messages only), Acknowledged, Reply Status and Replies To (Response messages only, linking to the message answered), Size, Recorded On This Ledger (consensus timestamp), **Peer Transaction**.

**Peer Transaction** is a raw link out to the peer ledger's own explorer, built from the Channel's peer chain ID (resolved to a peer-explorer URL via the same curated allow-list used by By Chain, 2.2.2) plus this message's ID. It is a plain external link with no embedded summary, since this explorer has no way to verify anything it would show.

**Lifecycle card:** states only what the mirror node records.

- Recorded on this ledger at the consensus timestamp.
- Acknowledged by the peer: yes or no. The acknowledgement time is not recorded.
- For a Response message: in reply to message N, with its status.
- This ledger does not record the reply to its own outbound message (HIP-1535 §6.4, by protocol design), so no "response received" step is shown for outbound Data.

**Payload card:** raw payload bytes, hex only. For a Control message, the stored control message is shown decoded as key/value pairs. Running Hash After (copyable). Decoding a Data message's own payload needs the target application's ABI; the explorer can offer that when the contract is verified on HashScan and fall back to raw bytes otherwise.

**Source:** `GET /api/v1/clpr/channels/{channelId}/messages?timestamp=eq:{consensusTimestamp}`.

# 4.0 Updates to Existing Pages

## 4.1 Transaction Type Labels

Add the CLPR transaction types to `makeTypeLabel` in `TransactionTools.ts` and to the Transactions page's type filter:

| Mirror node type | Label |
| --- | --- |
| CLPRREGISTERCHANNEL | CLPR Register Channel |
| CLPRCOMPLETECHANNEL | CLPR Complete Channel |
| CLPRCLOSECHANNEL | CLPR Close Channel |
| CLPRSUBMITBUNDLE | CLPR Submit Bundle |
| CLPRREGISTERCONNECTOR | CLPR Register Connector |
| CLPRCOMPLETECONNECTOR | CLPR Complete Connector |
| CLPRDEREGISTERCONNECTOR | CLPR Deregister Connector |
| CLPRUPDATELEDGERCONFIGURATION | CLPR Update Ledger Configuration |
| CLPRMAINTENANCE | CLPR Maintenance *(system-initiated)* |

- The type names and numbers are the `TransactionBody` field numbers. Eight of the nine (82–86, 88–90) are on mirror node `main` today, in `TransactionType.java` and in the REST type list (`openapi.yml`, `transactionType.js`). `CLPRMAINTENANCE` (92) exists only on the open ingestion PR (hiero-mirror-node#14636), so the filter value will not exist until that merges.
- `CLPRMAINTENANCE` is a system-initiated, block-stream-only transaction that initializes and reconciles the ledger configuration and endpoint manifest. It has no submitter and no fee.
- `ClprEndpointPublication` (91) is node-internal and out of the mirror node's scope, so it has no label. `ClprRedactMessage` (87) is excluded, since redaction is being removed from the protocol, although `main` still lists it in the REST type enum. The consensus node also defines `ClprEvictPeerEndpoint` (93), which the mirror node design does not cover, so it has no label.
- Sending a message is not its own transaction type. It appears as a contract call to the CLPR system contract (0x16e).

## 4.2 Transaction Detail Page

CLPR transactions use the standard transaction detail page, with the label from 4.1. The mirror node does not return a Channel or Connector ID on transactions, so Channel and Connector links are not possible from this page.

One exception: a contract call to the CLPR system contract (`0x16e`) that sent a message gets a **CLPR messages** card, listing each message it sent with a link to the message page (story 1.12). It is found by the transaction's consensus timestamp, tried against each Channel's messages. The Transactions list shows the same links in a CLPR messages column. Each row costs the same per-Channel fan-out as search (4.3), so the column loads lazily, only for visible rows whose transaction called `0x16e`, and shows a placeholder until it has loaded.

## 4.3 Search

Search is the primary entry point of the explorer's CLPR section. It is the first block of the Overview (2.2.1) and also replaces the disabled global search bar. It is live, type-ahead, and shows a dropdown grouped by type. The mirror node was designed around browsing one Channel at a time, so some lookups are direct and some are fan-outs; the table says which.

| You enter | Resolves to | How | Cost |
| --- | --- | --- | --- |
| Channel ID (32-byte hex) | Channel page (3.2) | `GET /channels?channel.id=eq:` | 1 call |
| Connector ID (32-byte hex) | Connector page (3.3) | No ledger-wide endpoint. For each Channel, `GET /channels/{id}/connectors?connector.id=eq:`, stopping at the first hit | Up to 1 call per Channel |
| `sendMessage` transaction ID | The message or messages it sent (3.4) | `GET /transactions/{id}` for its consensus timestamp, then for each Channel `GET /channels/{id}/messages?timestamp=eq:` | 1 + 1 per Channel |
| Consensus timestamp (seconds.nanoseconds) | Every message at that instant, across Channels | The same per-Channel `timestamp=eq:` queries | 1 per Channel |
| Peer chain ID | Peer Chain page (3.1) | Client-side over the Channels listing | None extra |
| Pending-channel ownership commitment | Pending tab (2.2.2) | Client-side over the pending listing | None extra |

Notes:

- **A 32-byte hex string** could be a Channel ID or a Connector ID. The explorer tries the Channel lookup first (one call) and runs the Connector fan-out only if no Channel matches.
- **A transaction ID is a workaround, not a mirror node feature** (story 1.12). The results say they were matched by consensus timestamp, and only outbound Data messages are found.
- **Not searchable:** a message ID on its own, a running hash, a bundle, or an inbound Data message. The Messages endpoint has no message ID filter, so "Channel plus message ID" cannot be a lookup either. A Channel's Messages tab (3.2) browses by time window, and a message page's URL carries its Channel, consensus timestamp and message ID so a link can be shared.
- **Fan-out cost grows with the Channel count.** The per-Channel queries run a few at a time and the box shows progress ("checked 14 of 40 Channels") so a slow search looks busy, not hung. The asks in 6.1 would remove the fan-outs.

Every view has a URL, so any hit is also a shareable link — pressing the browser back button returns to the previous view.

# 5.0 Display Rules

## 5.1 Values

Reuse the existing value components:

| Value | Component |
| --- | --- |
| IDs, hashes, fingerprints | `HexaValue`, shortened with copy |
| Message data | `BlobValue`, hex only, with decoded key/value pairs shown alongside for Control messages |
| Timestamps | `TimestampValue`, shown as relative time with the absolute UTC timestamp on hover |
| Stake and balances | `HbarAmount` |
| Admin keys | `KeyValue` / `ComplexKeyValue` |

## 5.2 Untrusted Values

Chain IDs, message data, senders and target applications all originate outside this ledger, and a Channel's creator chooses its own chain ID. For all of them:

- Display them as plain text or hex; never render them as markup or links.
- Truncate long values behind an expander. A chain ID can be kilobytes long.
- Percent-encode chain IDs in routes and API paths.

## 5.3 Network Flag

Add an `enableClpr` per-network setting alongside `enableStaking`, `enableWallet`, `enableExpiry` and `enableMarket`, defaulting to `false`. When it is off, hide the CLPR tab, every CLPR route, and the CLPR entries in global search.

# 6.0 Mirror Node Alignment

The mirror node design cited in 1.0 is authoritative. If it changes, this document changes with it.

It is only partly implemented. As of 2026-11-17 none of it is on mirror node `main` except the schema, the domain classes and an empty message listener hook. The endpoints are in open PRs (Channels #14689, Messages #14694, Connectors #14691, Configuration and Endpoint Manifest #14695) and the transaction ingestion in #14626 and #14636 (draft). No message rows are written anywhere yet, so the Messages tab and message search can't be tested against a live mirror node until those merge.

## 6.1 Asks of the mirror node (proposed)

The explorer is designed to work with the five endpoints as merged. The additions below would remove the fan-outs in search and fill the gaps in the Overview. They are proposals, not agreed. The implementation PRs listed above are still open, so changes may still be cheap.

| # | Ask | What it removes |
| --- | --- | --- |
| 1 | Look up a Connector by ID without a Channel (`GET /clpr/connectors?connector.id=eq:` or `GET /clpr/connectors/{connectorId}`) | The Connector search fan-out (1.14). A Connector ID is derived from its Channel ID, so it is unique and a point lookup is the cheapest kind of ledger-wide query |
| 2 | A ledger-wide message lookup by exact timestamp (`GET /clpr/messages?timestamp=eq:`; no ranges) | The transaction-ID and timestamp search fan-out (1.12). The table is time-partitioned, so an exact timestamp touches one partition. In `v2` it scatters across shards, which is why only the exact form is asked for. An alternative is to store the originating transaction ID on message rows and add a `transaction.id` filter, a larger schema change |
| 3 | A small stats endpoint (`GET /clpr/stats`): Channel counts by status and by chain, and message counts by type over a requested window | Rates and trends on the Overview (messages per day, new Channels per week), Connector totals, and last activity per network. The importer could maintain the counts as it ingests |
| 4 | A `message.id` filter inside a Channel's Messages endpoint | "Channel plus message ID" lookup. The design left it out because messages from one bundle share a timestamp; an exact message ID is a point read if indexed on channel and message ID |
| 5 | The last message timestamp on each Channel record | "Last activity" per Channel and network without a per-Channel query |
