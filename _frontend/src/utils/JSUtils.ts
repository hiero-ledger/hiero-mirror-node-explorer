// SPDX-License-Identifier: Apache-2.0

export function fetchJSValue(obj: unknown, attributeName: string): unknown | null {
    let result: unknown | null
    if (typeof obj === 'object' && obj !== null && attributeName in obj) {
        result = obj[attributeName as keyof typeof obj]
    } else {
        result = null
    }
    return result
}

export function fetchJSObject(obj: unknown, attributeName: string): object | null {
    const v = fetchJSValue(obj, attributeName)
    return typeof v == "object" && v !== null ? v : null
}

export function fetchJSArray(obj: unknown, attributeName: string): unknown[] | null {
    const v = fetchJSValue(obj, attributeName)
    return Array.isArray(v) ? v : null
}

export function fetchJSString(obj: unknown, attributeName: string): string | null {
    const v = fetchJSValue(obj, attributeName)
    return typeof v == "string" ? v : null
}
