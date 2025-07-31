// SPDX-License-Identifier: Apache-2.0

export class StakingPeriod {

    public readonly currentDate: Date
    public readonly startTime: number
    public readonly endTime: number
    public readonly durationMin: number
    public readonly elapsedMin: number
    public readonly remainingMin: number

    private static PERIOD_24H = 24 * 60 * 60 * 1000

    public constructor(startTimeInSec: number | null = null, endTimeInSec: number | null = null) {

        this.currentDate = new Date()
        if (startTimeInSec === null || isNaN(startTimeInSec)) {
            this.startTime = Date.UTC(this.currentDate.getUTCFullYear(), this.currentDate.getUTCMonth(), this.currentDate.getUTCDate())
        } else {
            this.startTime = startTimeInSec * 1000
        }
        if (endTimeInSec === null || isNaN(endTimeInSec)) {
            this.endTime = this.startTime + StakingPeriod.PERIOD_24H
        } else {
            this.endTime = endTimeInSec * 1000
        }

        this.durationMin = (this.endTime - this.startTime) / 1000 / 60
        this.elapsedMin = Math.floor((this.currentDate.getTime() - this.startTime) / 1000 / 60)
        this.remainingMin = Math.ceil((this.endTime - this.currentDate.getTime()) / 1000 / 60)
    }
}
