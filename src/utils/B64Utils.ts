// SPDX-License-Identifier: Apache-2.0


import base32Decode from "base32-decode";
import base32Encode from "base32-encode";
import {ethers} from "ethers";

//
// https://developer.mozilla.org/en-US/docs/Glossary/Base64
//

export function base64Decode(sBase64: string): Uint8Array {
    // We should simply use
    //  return ethers.decodeBase64(sBase64)
    // but in vitest environment this breaks
    // So we use implementation from ethers
    // https://github.com/ethers-io/ethers.js/blob/main/src.ts/utils/base64-browser.ts

    sBase64 = atob(sBase64);
    const data = new Uint8Array(sBase64.length);
    for (let i = 0; i < sBase64.length; i++) {
        data[i] = sBase64.charCodeAt(i);
    }
    return ethers.getBytes(data);
}


export function base64Encode(aBytes: Uint8Array): string {
    // We should simply use
    //  return ethers.encodeBase64(sBase64)
    // but in vitest environment this breaks
    // So we use implementation from ethers
    // https://github.com/ethers-io/ethers.js/blob/main/src.ts/utils/base64-browser.ts

    const data = ethers.getBytes(aBytes);
    let textData = "";
    for (let i = 0; i < data.length; i++) {
        textData += String.fromCharCode(data[i]);
    }
    return btoa(textData);
    // return ethers.encodeBase64(aBytes)
}

export function utf8Encode(aBytes: Uint8Array): string {
    return ethers.toUtf8String(aBytes, ethers.Utf8ErrorFuncs.replace)
}

//
// Hexa conversion
//

export function byteToHex(bytes: Uint8Array): string {
    return ethers.hexlify(bytes).slice(2)
}

export function paddedBytes(bytes: Uint8Array, length: number): Uint8Array {
    const result = new Uint8Array(length)
    const paddingLength = Math.max(0, length - bytes.length)
    result.set(bytes, paddingLength)
    return result
}

export function hexToByte(hex: string): Uint8Array | null {
    let result: Uint8Array | null
    try {
        hex = hex.startsWith("0x") ? hex : "0x" + hex
        result = ethers.getBytes(hex)
    } catch {
        result = null
    }
    return result
}

//
// Alias conversion
//

export function aliasToBase32(bytes: Uint8Array): string {
    return base32Encode(bytes, 'RFC4648', {padding: false})
}

export function base32ToAlias(aliasBase32: string): Uint8Array | null {
    let result: Uint8Array | null
    try {
        result = new Uint8Array(base32Decode(aliasBase32, 'RFC4648'))
    } catch {
        result = null
    }
    return result
}
