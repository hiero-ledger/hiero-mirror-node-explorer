// SPDX-License-Identifier: Apache-2.0

export function makeExchangeFormat(id: string): string {
    let result: string
    const re = /^\d{1,10}\.\d{1,10}\.\d{1,10}@\d{1,10}(\.\d{1,9})?$/

    if (re.test(id)) {
        result = id.replace('@', '-')
        const lastDot = result.lastIndexOf('.')
        result = result.substring(0, lastDot) + '-' + result.substring(lastDot + 1)
    } else {
        result = id
    }
    return result
}
