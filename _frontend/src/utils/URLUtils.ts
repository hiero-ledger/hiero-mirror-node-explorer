// SPDX-License-Identifier: Apache-2.0

import {CID} from "multiformats";

export function blob2URL(blob: string | null, ipfsGateway: string | null, arweaveServer: string | null): string | null {
    let result: string | null

    if (blob !== null) {
        if (isSecureURL(blob)) {
            result = blob
        } else if (ipfsGateway && blob.startsWith('ipfs://') && blob.length > 7) {
            result = `${ipfsGateway}${blob.substring(7)}`
        } else if (ipfsGateway && isIPFSHash(blob)) {
            result = `${ipfsGateway}${blob}`
        } else if (arweaveServer && blob.startsWith('ar://') && blob.length > 5) {
            result = `${arweaveServer}${blob.substring(5)}`
        } else if (arweaveServer && isArweaveHash(blob)) {
            result = `${arweaveServer}${blob}`
        } else {
            result = null
        }
    } else {
        result = null
    }
    return result
}

export function isSecureURL(blob: string): boolean {
    let isValid: boolean
    try {
        const url = new URL(blob)
        isValid = url.protocol == "https:"
    } catch {
        isValid = false
    }
    return isValid
}

export function isIPFSHash(blob: string): boolean {
    let isValid: boolean
    try {
        CID.parse(blob)
        isValid = true
    } catch {
        isValid = false
    }
    return isValid
}

export function isArweaveHash(hash: string): boolean {
    const re: RegExp = /^[a-zA-Z0-9_-]{43}$/
    return re.test(hash)
}

export function getDataURLType(dataURL: string): string | null {
    let result: string | null
    const DATA_URL_PREFIX = 'data:'
    if (dataURL.startsWith(DATA_URL_PREFIX)) {
        let delimiter = dataURL.indexOf(';')
        if (delimiter === -1) {
            delimiter = dataURL.indexOf(',')
        }
        if (delimiter !== -1) {
            result = dataURL.substring(DATA_URL_PREFIX.length, delimiter)
        } else {
            result = null
        }
    } else {
        result = null
    }
    return result
}
