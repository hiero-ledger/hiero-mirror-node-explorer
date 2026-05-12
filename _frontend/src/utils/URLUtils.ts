// SPDX-License-Identifier: Apache-2.0

import {CID} from "multiformats";

export function blob2URL(blob: string | null, ipfsGateway: string | null, arweaveServer: string | null): string | null {
    if (blob === null) {
        return null
    }

    let result: string | null = null
    if (isSecureURL(blob)) {
        result = blob
    }
    if (!result && ipfsGateway) {
        result = blob2ProtocolURL(blob, 'ipfs://', isIPFSHash, ipfsGateway)
    }
    if (!result && arweaveServer) {
        result = blob2ProtocolURL(blob, 'ar://', isArweaveHash, arweaveServer)
    }
    return result
}

function blob2ProtocolURL(blob: string, scheme: string, isValidHash: (s: string) => boolean, server: string): string | null {
    const uri = blob.startsWith(scheme) ? blob.substring(scheme.length) : blob
    const uriParts = uri.split('/')
    if (!isValidHash(uriParts[0])) {
        return null
    }
    const encodedPath = uriParts.map((part, index) => {
        return index === 0 ? encodeURI(part) : encodeURIComponent(part)
    }).join('/')
    return `${server}${encodedPath}`
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
