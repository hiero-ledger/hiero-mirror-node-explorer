// SPDX-License-Identifier: Apache-2.0

// CLPR economic configuration. Not available from the mirror node REST API (see design doc), hence kept here
// as constants known by the Explorer. Amounts are in tinybars.
// NOTE: values are the ones of the HTML mockup, which flags them as placeholders to be verified.

import {ClprConnector} from "@/schemas/MirrorNodeSchemas.ts";

const TINYBARS_PER_HBAR = 100_000_000

export const CLPR_ECONOMICS = {
    minLockedStake: 1 * TINYBARS_PER_HBAR,
    basePenalty: 0.1 * TINYBARS_PER_HBAR,
    penaltyMultiplier: 2,
    slashBanThreshold: 5,
    endpointMarginPercent: 10,
    connectorQueueQuotaPercent: 50, // of the max queue depth of the ledger configuration
}

export enum ClprConnectorState {
    HEALTHY = "Healthy",
    NEAR_BAN = "Near ban",
    LOW_STAKE = "Low stake",
    BANNED = "Banned",
    DEREGISTERED = "Deregistered",
}

// Derived from the connector fields and the economic constants. A "Low balance" state exists in the mockup
// but needs the connector balance, which is not available for now.
export function getConnectorState(connector: ClprConnector): ClprConnectorState {
    let result: ClprConnectorState
    if (connector.deleted) {
        result = connector.slash_count >= CLPR_ECONOMICS.slashBanThreshold
            ? ClprConnectorState.BANNED
            : ClprConnectorState.DEREGISTERED
    } else if (connector.slash_count >= CLPR_ECONOMICS.slashBanThreshold - 1) {
        result = ClprConnectorState.NEAR_BAN
    } else if (Number(connector.locked_stake) < CLPR_ECONOMICS.minLockedStake) {
        result = ClprConnectorState.LOW_STAKE
    } else {
        result = ClprConnectorState.HEALTHY
    }
    return result
}

// Number of in-flight messages a connector may have: a share of the ledger's max queue depth
export function getConnectorQuota(maxQueueDepth: number): number {
    return Math.floor(maxQueueDepth * CLPR_ECONOMICS.connectorQueueQuotaPercent / 100)
}

// Penalty applied by the next slash: base penalty × multiplier^(number of slashes already applied)
export function getNextPenalty(slashCount: number): number {
    return CLPR_ECONOMICS.basePenalty * Math.pow(CLPR_ECONOMICS.penaltyMultiplier, slashCount)
}
