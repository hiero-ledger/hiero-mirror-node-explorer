// SPDX-License-Identifier: Apache-2.0

// Channel health: an indicator derived by the Explorer, not protocol state.

import {ClprChannel, ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";

// Placeholder rule inherited from the HTML mockup, to be settled (per network, or from the channel's own cadence)
export const CLPR_HEALTH = {
    staleAfterHours: 6
}

export enum ClprChannelHealth {
    HEALTHY = "Healthy",
    STALE = "Stale",
    PAUSED = "Paused",
    CLOSING = "Closing",
    DRAINED = "Drained",
    CLOSED = "Closed",
}

// Messages sent from this ledger and not yet acknowledged by the peer
export function getChannelBacklog(channel: ClprChannel): number | null {
    return channel.next_message_id !== null && channel.acked_message_id !== null
        ? channel.next_message_id - 1 - channel.acked_message_id
        : null
}

// An ACTIVE channel is stale when it has a backlog whose oldest message has been waiting for the peer's
// acknowledgement for longer than the threshold. That message is passed as oldestUnackedTimestamp (seconds.nanos),
// null when there is none to be found (a backlog with no message found is older than what could be queried).
export function getChannelHealth(channel: ClprChannel, oldestUnackedTimestamp: string | null, nowSeconds: number): ClprChannelHealth {
    let result: ClprChannelHealth
    switch (channel.status) {
        case ClprChannelStatus.PAUSED:
            result = ClprChannelHealth.PAUSED
            break
        case ClprChannelStatus.CLOSING:
            result = ClprChannelHealth.CLOSING
            break
        case ClprChannelStatus.DRAINED:
            result = ClprChannelHealth.DRAINED
            break
        case ClprChannelStatus.CLOSED:
            result = ClprChannelHealth.CLOSED
            break
        default: {
            const backlog = getChannelBacklog(channel) ?? 0
            const waitingHours = oldestUnackedTimestamp !== null ? (nowSeconds - Number(oldestUnackedTimestamp)) / 3600 : Infinity
            result = backlog > 0 && waitingHours > CLPR_HEALTH.staleAfterHours
                ? ClprChannelHealth.STALE
                : ClprChannelHealth.HEALTHY
        }
    }
    return result
}

export function getChannelWaitingHours(oldestUnackedTimestamp: string | null, nowSeconds: number): number | null {
    return oldestUnackedTimestamp !== null ? (nowSeconds - Number(oldestUnackedTimestamp)) / 3600 : null
}
