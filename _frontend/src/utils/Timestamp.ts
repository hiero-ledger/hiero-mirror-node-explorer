// SPDX-License-Identifier: Apache-2.0

export class Timestamp {

    public readonly seconds: number
    public readonly nanoseconds: number

    //
    // Public
    //

    public static parse(timestamp: string): Timestamp | null {
        let result: Timestamp | null

        const i = timestamp.indexOf(".")
        const s = i != -1 ? timestamp.slice(0, i) : null
        const n = i != -1 ? timestamp.slice(i + 1) : null
        if (s !== null && n !== null && n.indexOf(".") == -1) {
            const seconds = parseInt(s)
            const nanoseconds = parseInt(n)
            if (isNaN(seconds) || isNaN(nanoseconds)) {
                result = null
            } else {
                result = new Timestamp(seconds, nanoseconds)
            }
        } else {
            result = null
        }

        return result
    }

    public toString(): string {
        return this.seconds + "." + this.nanoseconds.toString().padStart(9, "0")
    }

    public static computeRange(t1: string, t2: string): number | null {
        let result: number | null

        const tt1 = Timestamp.parse(t1)
        const tt2 = Timestamp.parse(t2)
        if (tt1 !== null && tt2 !== null) {
            result = tt2.nanoSeconds(tt1)
        } else {
            result = null
        }
        return result
    }

    public nanoSeconds(from: Timestamp): number {
        const secondDelta = this.seconds - from.seconds
        const nanosecondDelta = this.nanoseconds - from.nanoseconds
        return secondDelta * 1_000_000_000 + nanosecondDelta
    }

    //
    // Private
    //

    private constructor(seconds: number, nanoseconds: number) {
        this.seconds = seconds
        this.nanoseconds = nanoseconds
    }
}
