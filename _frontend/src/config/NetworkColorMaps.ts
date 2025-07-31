// SPDX-License-Identifier: Apache-2.0

export interface ColorMap {
    // The light variants
    lightButtonTextColor: string | null,
    lightButtonColor: string | null,
    lightChipTextColor: string | null,
    lightChipColor: string | null,
    lightTextAccentColor: string | null,
    lightBorderAccentColor: string | null,
    lightGraphBarColor: string | null,

    // The dark variants
    darkButtonTextColor: string | null,
    darkButtonColor: string | null,
    darkChipTextColor: string | null,
    darkChipColor: string | null,
    darkTextAccentColor: string | null,
    darkBorderAccentColor: string | null,
    darkGraphBarColor: string | null,
}

export class NetworkColorMaps {

    private readonly entries: ColorMap[]

    public getColorMap(index: number): ColorMap {
        return this.entries[index % this.entries.length]
    }

    public constructor() {
        this.entries = [
            {
                lightButtonTextColor: NetworkColorMaps.getCssVariable('--purple-light-button-text-color'),
                lightButtonColor: NetworkColorMaps.getCssVariable('--purple-light-button-color'),
                lightChipTextColor: NetworkColorMaps.getCssVariable('--purple-light-chip-text-color'),
                lightChipColor: NetworkColorMaps.getCssVariable('--purple-light-chip-color'),
                lightTextAccentColor: NetworkColorMaps.getCssVariable('--purple-light-text-accent-color'),
                lightBorderAccentColor: NetworkColorMaps.getCssVariable('--purple-light-border-accent-color'),
                lightGraphBarColor: NetworkColorMaps.getCssVariable('--purple-light-graph-bar-color'),

                darkButtonTextColor: NetworkColorMaps.getCssVariable('--purple-dark-button-text-color'),
                darkButtonColor: NetworkColorMaps.getCssVariable('--purple-dark-button-color'),
                darkChipTextColor: NetworkColorMaps.getCssVariable('--purple-dark-chip-text-color'),
                darkChipColor: NetworkColorMaps.getCssVariable('--purple-dark-chip-color'),
                darkTextAccentColor: NetworkColorMaps.getCssVariable('--purple-dark-text-accent-color'),
                darkBorderAccentColor: NetworkColorMaps.getCssVariable('--purple-dark-border-accent-color'),
                darkGraphBarColor: NetworkColorMaps.getCssVariable('--purple-dark-graph-bar-color'),
            },
            {
                lightButtonTextColor: NetworkColorMaps.getCssVariable('--orange-light-button-text-color'),
                lightButtonColor: NetworkColorMaps.getCssVariable('--orange-light-button-color'),
                lightChipTextColor: NetworkColorMaps.getCssVariable('--orange-light-chip-text-color'),
                lightChipColor: NetworkColorMaps.getCssVariable('--orange-light-chip-color'),
                lightTextAccentColor: NetworkColorMaps.getCssVariable('--orange-light-text-accent-color'),
                lightBorderAccentColor: NetworkColorMaps.getCssVariable('--orange-light-border-accent-color'),
                lightGraphBarColor: NetworkColorMaps.getCssVariable('--orange-light-graph-bar-color'),

                darkButtonTextColor: NetworkColorMaps.getCssVariable('--orange-dark-button-text-color'),
                darkButtonColor: NetworkColorMaps.getCssVariable('--orange-dark-button-color'),
                darkChipTextColor: NetworkColorMaps.getCssVariable('--orange-dark-chip-text-color'),
                darkChipColor: NetworkColorMaps.getCssVariable('--orange-dark-chip-color'),
                darkTextAccentColor: NetworkColorMaps.getCssVariable('--orange-dark-text-accent-color'),
                darkBorderAccentColor: NetworkColorMaps.getCssVariable('--orange-dark-border-accent-color'),
                darkGraphBarColor: NetworkColorMaps.getCssVariable('--orange-dark-graph-bar-color'),
            },
            {
                lightButtonTextColor: NetworkColorMaps.getCssVariable('--yellow-light-button-text-color'),
                lightButtonColor: NetworkColorMaps.getCssVariable('--yellow-light-button-color'),
                lightChipTextColor: NetworkColorMaps.getCssVariable('--yellow-light-chip-text-color'),
                lightChipColor: NetworkColorMaps.getCssVariable('--yellow-light-chip-color'),
                lightTextAccentColor: NetworkColorMaps.getCssVariable('--yellow-light-text-accent-color'),
                lightBorderAccentColor: NetworkColorMaps.getCssVariable('--yellow-light-border-accent-color'),
                lightGraphBarColor: null,

                darkButtonTextColor: NetworkColorMaps.getCssVariable('--yellow-dark-button-text-color'),
                darkButtonColor: NetworkColorMaps.getCssVariable('--yellow-dark-button-color'),
                darkChipTextColor: NetworkColorMaps.getCssVariable('--yellow-dark-chip-text-color'),
                darkChipColor: NetworkColorMaps.getCssVariable('--yellow-dark-chip-color'),
                darkTextAccentColor: NetworkColorMaps.getCssVariable('--yellow-dark-text-accent-color'),
                darkBorderAccentColor: NetworkColorMaps.getCssVariable('--yellow-dark-border-accent-color'),
                darkGraphBarColor: null,
            }]
    }

    private static getCssVariable(name: string): string {
        return window.getComputedStyle(document.body).getPropertyValue(name)
    }
}
