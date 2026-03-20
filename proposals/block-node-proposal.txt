# **Block Node Support in Mirror Node Explorer**

# 1.0 Objective

Enhance the Hiero Mirror Node Explorer to support HIP-1137 registered service nodes, including:

- Block Nodes
- Mirror Nodes
- JSON-RPC Relays

The implementation will follow the existing HashScan UX pattern:

- Top-level table view (`/nodes/table`)
- Detail page view (`/node/{id}`)
- Sub-tables within detail pages

All service types will be implemented in this release.

# 2.0 Explorer Structure & Tables

## 2.1 Top-Level Navigation

Nodes

├── Network

├── **Consensus Nodes** *(renamed from “Node Table”)*

├── **Block Nodes**

├── **Mirror Nodes**

└── **JSON-RPC Relays**

Each tab renders a table view consistent with the existing Consensus Node table UX.

# 2.2 Table Views (All Service Types)

Each tab displays **one row per Registered Node** (HIP-1137).

Design principle:

- Tables = lightweight, discoverable
- Detail pages = operational & configuration metadata

## 2.2.1 Block Nodes Tab

**Header Content:**

Block Nodes provide verifiable block data derived from Block Streams and serve as canonical data sources for explorer and mirror tooling.

### Table Columns

| Registered Node ID | Description | Service Endpoints |
| --- | --- | --- |
| 14 | Dell Block Node | api.dellblock.com:443 |

### Column Definitions

- **Registered Node ID** – Unique HIP-1137 identifier
- **Description** – On-chain description field
- **Service Endpoints** – Primary endpoint (if multiple exist, show first + “+N more”)

Clicking a row routes to:

`/block-node/{registeredNodeId}`

---

## 2.2.2 Mirror Nodes Tab

**Header Content:**

Mirror Nodes provide indexed query access to network data for analytics, APIs, and explorer integrations.

### Table Columns

| Registered Node ID | Description | Service Endpoints |
| --- | --- | --- |

Clicking a row routes to:

`/mirror-node/{registeredNodeId}`

---

## 2.2.3 JSON-RPC Relays Tab

**Header Content:**

JSON-RPC Relays provide Ethereum-compatible RPC interfaces for interacting with Hedera smart contracts and EVM tooling.

### Table Columns

| Registered Node ID | Description | Service Endpoints |
| --- | --- | --- |

Clicking a row routes to:

`/json-rpc-relay/{registeredNodeId}`

---

# 2.3 Detail Page Structure (Sub-Table Pattern)

Each service type has its own detail page following the current pattern used at:

`/node/{consensusNodeId}`

---

## 2.3.1 Block Node Detail Page

Route:

`/block-node/{registeredNodeId}`

---

### Section A: Overview

| Field | Value |
| --- | --- |
| Registered Node ID | 14 |
| Description | Dell Block Node |
| Admin Key | 0xabc... |
| Service Type | Block Node |

### Section B: Service Endpoints

| Endpoint | Port | TLS Required |
| --- | --- | --- |
| api.dellblock.com | 443 | Yes |
| 34.82.11.4 | 5600 | No |

Notes:

- All endpoints displayed
- TLS requirement shown per endpoint
- Supports multiple endpoints

### Section C: Associated Consensus Nodes

| Consensus Node ID | Node Account | Description |
| --- | --- | --- |
| 0 | 0.0.3 | Dell Council Node |

Derived from the `associated_registered_node` relationship in consensus node records.

## 2.3.2 Mirror Node Detail Page

Route:

`/mirror-node/{registeredNodeId}`

### Sections:

1. Overview
2. Service Endpoints
3. Associated Consensus Nodes

Structure identical to Block Node detail page for consistency.

## 2.3.3 JSON-RPC Relay Detail Page

Route:

`/json-rpc-relay/{registeredNodeId}`

### Sections:

1. Overview
2. Service Endpoints
3. Associated Consensus Nodes

Consistent layout across all service types.

# 3.0 Updates to Consensus Node Pages

Existing page:

`/node/{consensusNodeId}`

## 3.1 Rename “Node Table” to “Consensus Nodes”

Navigation update required.

## 3.2 Add Associated Service Nodes Section

Add new section to Consensus Node Detail page:

### Associated Service Nodes

| Service Type | Registered Node ID | Description |
| --- | --- | --- |
| Block Node | 14 | Dell Block Node |
| Mirror Node | 15 | Dell Mirror Node |
| JSON-RPC Relay | 16 | Dell Relay |

### Linking Requirement (Bonus)

- Registered Node ID must be clickable
- Clicking navigates to corresponding service node detail page
- Deep links must preserve network context (mainnet/testnet/etc)