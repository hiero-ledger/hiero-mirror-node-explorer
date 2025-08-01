// SPDX-License-Identifier: Apache-2.0


//
// Tools
//

import MockAdapter from "axios-mock-adapter";

export function cloneMock(mock: object): any {
    return JSON.parse(JSON.stringify(mock))
}

export function fetchGetURLs(mock: MockAdapter): string[] {
    const result: string[] = []
    for (const e of mock.history.get) {
        if (e.url) {
            result.push(e.url)
        }
    }
    return result
}
