// SPDX-License-Identifier: Apache-2.0

import {computed, inject, ref, watch} from "vue";
import {AppStorage} from "@/AppStorage.ts";
import {themeControllerKey} from "@/AppKeys.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";

export class ThemeController {

    public readonly coreConfig: CoreConfig
    public readonly darkSelected = ref(false)

    //
    // Public
    //

    public constructor(coreConfig: CoreConfig) {
        this.coreConfig = coreConfig
    }

    public mount(): void {
        this.darkSelected.value = AppStorage.getTheme() === 'dark'
        watch(this.darkSelected, this.darkSelectedDidChange, {immediate: true})
    }

    public productLogoURL = computed(() => {
        return this.darkSelected.value
            ? this.coreConfig.productLogoDarkURL
            : this.coreConfig.productLogoLightURL
    })

    public productMiniLogoURL = computed(() => {
        return this.darkSelected.value
            ? this.coreConfig.productMiniLogoDarkURL
            : this.coreConfig.productMiniLogoLightURL
    })

    public getTextPrimaryColor(): string {
        return this.getCssVariable("--text-primary")
    }

    public getTextSecondaryColor(): string {
        return this.getCssVariable("--text-secondary")
    }

    public getGraphBarColor(): string {
        return this.getCssVariable("--network-graph-bar-color")
    }

    public getGraphLineColor(): string {
        return this.getCssVariable("--graph-line-color")
    }

    public getGraphGradientStartColor(): string {
        return this.getCssVariable("--graph-gradient-start-color")
    }

    public getGraphGradientEndColor(): string {
        return this.getCssVariable("--graph-gradient-end-color")
    }

    public getCssVariable(name: string): string {
        return window.getComputedStyle(document.body).getPropertyValue(name)
    }

    public static inject(): ThemeController {
        const defaultFactory = () => {
            const result = new ThemeController(CoreConfig.FALLBACK)
            result.mount()
            return result
        }
        return inject<ThemeController>(themeControllerKey, defaultFactory, true)
    }

    //
    // Private
    //

    private darkSelectedDidChange = () => {
        if (this.darkSelected.value) {
            AppStorage.setTheme('dark')
            document.documentElement.style.setProperty('--network-button-text-color', 'var(--dark-network-button-text-color)')
            document.documentElement.style.setProperty('--network-button-color', 'var(--dark-network-button-color)')
            document.documentElement.style.setProperty('--network-chip-text-color', 'var(--dark-network-chip-text-color)')
            document.documentElement.style.setProperty('--network-chip-color', 'var(--dark-network-chip-color)')
            document.documentElement.style.setProperty('--network-text-accent-color', 'var(--dark-network-text-accent-color)')
            document.documentElement.style.setProperty('--network-border-accent-color', 'var(--dark-network-border-accent-color)')
            document.documentElement.style.setProperty('--network-graph-bar-color', 'var(--dark-network-graph-bar-color)')

            document.documentElement.style.setProperty('--text-primary', 'var(--dark-text-primary)')
            document.documentElement.style.setProperty('--text-secondary', 'var(--dark-text-secondary)')
            document.documentElement.style.setProperty('--text-accent', 'var(--network-text-accent-color)')
            document.documentElement.style.setProperty('--text-accent2', 'var(--dark-text-accent2)')
            document.documentElement.style.setProperty('--text-success', 'var(--dark-text-success)')
            document.documentElement.style.setProperty('--text-error', 'var(--dark-text-error)')
            document.documentElement.style.setProperty('--text-disabled', 'var(--dark-text-disabled)')
            document.documentElement.style.setProperty('--background-primary', 'var(--dark-background-primary)')
            document.documentElement.style.setProperty('--background-primary-transparent', 'var(--dark-background-primary-transparent)')
            document.documentElement.style.setProperty('--background-secondary', 'var(--dark-background-secondary)')
            document.documentElement.style.setProperty('--background-tertiary', 'var(--dark-background-tertiary)')
            document.documentElement.style.setProperty('--border-primary', 'var(--dark-border-primary)')
            document.documentElement.style.setProperty('--border-secondary', 'var(--dark-border-secondary)')
            document.documentElement.style.setProperty('--table-border', 'var(--dark-table-border)')
            document.documentElement.style.setProperty('--chip-primary', 'var(--network-chip-color)')
            document.documentElement.style.setProperty('--chip-text-primary', 'var(--dark-chip-text-primary)')
            document.documentElement.style.setProperty('--chip-secondary-default', 'var(--dark-chip-secondary-default)')
            document.documentElement.style.setProperty('--button-text-primary', 'var(--dark-button-text-primary)')
            document.documentElement.style.setProperty('--button-text-secondary', 'var(--dark-button-text-secondary)')
            document.documentElement.style.setProperty('--button-background-primary', 'var(--network-button-color)')
            document.documentElement.style.setProperty('--button-background-secondary', 'var(--dark-button-background-secondary)')
            document.documentElement.style.setProperty('--copy-button-text', 'var(--dark-copy-button-text)')
            document.documentElement.style.setProperty('--copy-button-background', 'var(--dark-copy-button-background)')
            document.documentElement.style.setProperty('--tab-background', 'var(--dark-tab-background)')
            document.documentElement.style.setProperty('--icon-default-color', 'var(--dark-icon-default-color)')
            document.documentElement.style.setProperty('--status-success-color', 'var(--dark-status-success-color)')
            document.documentElement.style.setProperty('--status-error-color', 'var(--dark-status-error-color)')
            document.documentElement.style.setProperty('--search-bar-default', 'var(--dark-search-bar-default)')
            document.documentElement.style.setProperty('--graph-line-color', 'var(--dark-graph-line-color)')
            document.getElementById('product-logo')?.setAttribute('src', this.coreConfig.productLogoDarkURL ?? '')
            document.getElementById('product-mini-logo')?.setAttribute('src', this.coreConfig.productMiniLogoDarkURL ?? '')
            document.getElementById('sponsor-logo')?.setAttribute('src', this.coreConfig.sponsorLogoDarkURL ?? '')
            document.getElementById('built-on-logo')?.setAttribute('src', this.coreConfig.builtOnLogoDarkURL ?? '')
            document.getElementById('crypto-logo')?.setAttribute('src', this.coreConfig.cryptoLogoDarkURL ?? '')

        } else {
            AppStorage.setTheme('light')
            document.documentElement.style.setProperty('--network-button-text-color', 'var(--light-network-button-text-color)')
            document.documentElement.style.setProperty('--network-button-color', 'var(--light-network-button-color)')
            document.documentElement.style.setProperty('--network-chip-text-color', 'var(--light-network-chip-text-color)')
            document.documentElement.style.setProperty('--network-chip-color', 'var(--light-network-chip-color)')
            document.documentElement.style.setProperty('--network-text-accent-color', 'var(--light-network-text-accent-color)')
            document.documentElement.style.setProperty('--network-border-accent-color', 'var(--light-network-border-accent-color)')
            document.documentElement.style.setProperty('--network-graph-bar-color', 'var(--light-network-graph-bar-color)')

            document.documentElement.style.setProperty('--text-primary', 'var(--light-text-primary)')
            document.documentElement.style.setProperty('--text-secondary', 'var(--light-text-secondary)')
            document.documentElement.style.setProperty('--text-accent', 'var(--network-text-accent-color)')
            document.documentElement.style.setProperty('--text-accent2', 'var(--light-text-accent2)')
            document.documentElement.style.setProperty('--text-success', 'var(--light-text-success)')
            document.documentElement.style.setProperty('--text-error', 'var(--light-text-error)')
            document.documentElement.style.setProperty('--text-disabled', 'var(--light-text-disabled)')
            document.documentElement.style.setProperty('--background-primary', 'var(--light-background-primary)')
            document.documentElement.style.setProperty('--background-primary-transparent', 'var(--light-background-primary-transparent)')
            document.documentElement.style.setProperty('--background-secondary', 'var(--light-background-secondary)')
            document.documentElement.style.setProperty('--background-tertiary', 'var(--light-background-tertiary)')
            document.documentElement.style.setProperty('--border-primary', 'var(--light-border-primary)')
            document.documentElement.style.setProperty('--border-secondary', 'var(--light-border-secondary)')
            document.documentElement.style.setProperty('--table-border', 'var(--light-table-border)')
            document.documentElement.style.setProperty('--chip-primary', 'var(--network-chip-color)')
            document.documentElement.style.setProperty('--chip-text-primary', 'var(--light-chip-text-primary)')
            document.documentElement.style.setProperty('--chip-secondary-default', 'var(--light-chip-secondary-default)')
            document.documentElement.style.setProperty('--button-text-primary', 'var(--light-button-text-primary)')
            document.documentElement.style.setProperty('--button-text-secondary', 'var(--light-button-text-secondary)')
            document.documentElement.style.setProperty('--button-background-primary', 'var(--network-button-color)')
            document.documentElement.style.setProperty('--button-background-secondary', 'var(--light-button-background-secondary)')
            document.documentElement.style.setProperty('--copy-button-text', 'var(--light-copy-button-text)')
            document.documentElement.style.setProperty('--copy-button-background', 'var(--light-copy-button-background)')
            document.documentElement.style.setProperty('--tab-background', 'var(--light-tab-background)')
            document.documentElement.style.setProperty('--icon-default-color', 'var(--light-icon-default-color)')
            document.documentElement.style.setProperty('--status-success-color', 'var(--light-status-success-color)')
            document.documentElement.style.setProperty('--status-error-color', 'var(--light-status-error-color)')
            document.documentElement.style.setProperty('--search-bar-default', 'var(--light-search-bar-default)')
            document.documentElement.style.setProperty('--graph-line-color', 'var(--light-graph-line-color)')
            document.getElementById('product-logo')?.setAttribute('src', this.coreConfig.productLogoLightURL ?? '')
            document.getElementById('product-mini-logo')?.setAttribute('src', this.coreConfig.productMiniLogoLightURL ?? '')
            document.getElementById('sponsor-logo')?.setAttribute('src', this.coreConfig.sponsorLogoLightURL ?? '')
            document.getElementById('built-on-logo')?.setAttribute('src', this.coreConfig.builtOnLogoLightURL ?? '')
            document.getElementById('crypto-logo')?.setAttribute('src', this.coreConfig.cryptoLogoLightURL ?? '')
        }

    }
}
