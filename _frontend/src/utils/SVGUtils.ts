// SPDX-License-Identifier: Apache-2.0

const STROKE_WIDTH = 1

/*

        x0       x1       x2       x3       x4       x5       x6       x7       x8
    y0                    o                          o


    yb  o        o                 o        o                 o        o        o


    yc                    o                          o

    y1                    o                          o

 */

export function makeTransferSVG(width: number, height: number, dy: number,
                                sourceCount: number, destCount: number,
                                rowIndex: number): string {

    const path = makeTransferPathZ(width, height, dy, sourceCount, destCount, rowIndex)

    let result = "<svg style='width: 100%; height: 100%; position: absolute; left:0; top:0' viewBox='0 0 " + width + " " + height + "'>\n"
    result += "<path d='" + path
        + "' stroke=" + window.getComputedStyle(document.body).getPropertyValue('--text-primary')
        + " stroke-width='" + STROKE_WIDTH
        + "' fill='none' />\n"
    result += "</svg>"

    return result
}

export function makeTransferPathZ(width: number, height: number, dy: number,
                                  sourceCount: number, destCount: number,
                                  rowIndex: number): string {


    const dx = width / 8.0
    const x0 = 0.0
    const x1 = x0 + dx
    const x2 = x1 + dx
    const x3 = x2 + dx
    const x4 = x3 + dx
    const x5 = x4 + dx
    const x6 = x5 + dx
    const x7 = x6 + dx
    const x8 = x7 + dx - STROKE_WIDTH // -STROKE_WIDTH to avoid truncating tip of the arrow

    const y0 = 0
    const y1 = height
    const yb = Math.min(y0 + dy, y1)
    const yc = Math.min(yb + dy, y1)

    let result = ""

    if (rowIndex == 0) {

        // Straight line from (x0, yc) to (x7, yc)
        result += "M " + x0 + " " + yb + " L " + x8 + " " + yb + " "

        if (rowIndex + 1 < sourceCount) {
            // There is another source on the next row
            // Curve from (x2, y1) to (x3, yb)
            if (yb < yc) {
                result += "M " + x2 + " " + y1 + "L " + x2 + " " + yc + " Q " + x2 + " " + yb + " " + x3 + " " + yb + " "
            } else {
                result += "M " + x2 + " " + y1 + " Q " + x2 + " " + yb + " " + x3 + " " + yc + " "
            }
        }

        if (rowIndex + 1 < destCount) {
            // There is another destination on the next row
            // Curve from (x4, yb) to (x5, y1)
            if (yb < yc) {
                result += "M " + x4 + " " + yb + " Q " + x5 + " " + yb + " " + x5 + " " + yc + " L " + x5 + " " + y1
            } else {
                result += "M " + x4 + " " + yb + " Q " + x5 + " " + yb + " " + x5 + " " + y1 + " "
            }
        }

    } else {

        if (rowIndex < sourceCount) {
            // Curve from (x0, yb) to (x2, y0)
            result += "M " + x0 + " " + yb + " L " + x1 + " " + yb + " Q " + x2 + " " + yb + " " + x2 + " " + y0
        }
        if (rowIndex < destCount) {
            // Curve from (x5, y0) to (x8, yb)
            result += "M " + x5 + " " + y0 + " Q " + x5 + " " + yb + " " + x6 + " " + yb + " L " + x8 + " " + yb
        }

        if (rowIndex + 1 < sourceCount) {
            // There is another source on the next row
            // Line from (x2, y0) to (x2, y1)
            result += "M " + x2 + " " + y0 + " L " + x2 + " " + y1 + " "
        }

        if (rowIndex + 1 < destCount) {
            // There is another destination on the next row
            // Line from (x2, y0) to (x2, y1)
            result += "M " + x5 + " " + y0 + " L " + x5 + " " + y1 + " "
        }
    }

    // Arrow
    if (rowIndex < destCount) {
        const xu = x8 - dx
        const yu1 = yb - dx
        const yu2 = yb + dx
        result +=
            "M " + xu + " " + yu1 + " " +
            "L " + x8 + " " + yb + " " +
            "L " + xu + " " + yu2 + " "
    }

    return result

}
