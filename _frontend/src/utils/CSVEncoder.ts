// SPDX-License-Identifier: Apache-2.0

export abstract class CSVEncoder<E> {

    private readonly entities: E[]
    public readonly dateFormat: Intl.DateTimeFormat


    //
    // Public
    //

    public constructor(entities: E[], dateFormat: Intl.DateTimeFormat) {
        this.entities = entities
        this.dateFormat = dateFormat
    }

    public encode(): string {
        let result = ""
        const headerRow = this.encodeHeaderRow()
        if (headerRow !== null) {
            result += this.makeLine(headerRow)
        }
        for (const e of this.entities) {
            for (const r of this.encodeEntity(e)) {
                if (result.length >= 1) {
                    result += "\n"
                }
                result += this.makeLine(r)
            }
        }
        return result
    }


    //
    // Protected (to be subclassed)
    //

    protected abstract encodeEntity(entity: E): string[][]

    protected abstract encodeHeaderRow(): string[] | null

    //
    // Protected
    //

    protected formatTimestamp(t: string): string {
        const seconds = Number.parseFloat(t);
        return isNaN(seconds) ? t : this.dateFormat.format(seconds * 1000)
    }

    protected formatAmount(tbarValue: number): string {
        return this.amountFormatter.format(tbarValue / 100000000)
    }

    //
    // Private
    //

    private makeLine(row: string[]): string {
        let result = ""

        for (const s of row) {
            if (result.length >= 1) {
                result += ","
            }
            result += this.makeValue(s)
        }

        return result
    }

    private makeValue(s: string): string {
        let result: string
        /*
            RFC 4180 ommon Format and MIME Type for Comma-Separated Values (CSV) Files
                2.  Definition of the CSV Format
                    6.  Fields containing line breaks (CRLF), double quotes, and commas
                        should be enclosed in double-quotes.  For example:
         */
        const needsQuote = s.indexOf("\n") != -1 || s.indexOf("\"") != -1 || s.indexOf(",") != -1

        if (needsQuote) {
            result = "\""
            for (const ch of s) {
                result += ch == "\"" ? "\"\"" : ch
            }
            result += "\""
        } else {
            result = s
        }

        return result
    }

    private readonly amountFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
        signDisplay: "exceptZero"
    })
}