// SPDX-License-Identifier: Apache-2.0

// Long hex ids are abbreviated as in 0x1a2b…3c4d; the full value is expected to be available elsewhere (tooltip)
export function shortenHex(value: string): string {
    return value.length > 14 ? value.slice(0, 6) + "…" + value.slice(-4) : value
}

// Pill color of the reply status of a message: only SUCCESS is a success
export function getReplyStatusLevel(replyStatus: string): "success" | "error" {
    return replyStatus === "SUCCESS" ? "success" : "error"
}
