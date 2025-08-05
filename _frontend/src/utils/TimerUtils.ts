// SPDX-License-Identifier: Apache-2.0

// Wraps window.setTimeout() in an async function
export async function waitFor(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
