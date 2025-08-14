// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {fetchString, fetchURL, localPathToURL} from "@/config/ConfigUtils";
import {inject} from "vue";
import {coreConfigKey} from "@/AppKeys";


export class CoreConfig {

    public static FALLBACK = CoreConfig.parse({})

    //
    // Public
    //

    public static async load(url: string): Promise<CoreConfig> {
        let result: CoreConfig
        const response = await axios.get<unknown>(url)
        if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
            result = this.parse(response.data as Record<string, unknown>)
        } else {
            throw new Error("core-config.json is missing or cannot be decoded")
        }
        return result
    }

    public static inject(): CoreConfig {
        return inject<CoreConfig>(coreConfigKey, this.FALLBACK)
    }

    public static make(): CoreConfig { // For unit testing
        return CoreConfig.parse({})
    }

    //
    // Private
    //

    private constructor(
        // The name of the product as shown in the short form of the footer tagline
        public readonly productName: string,
        // The URL of the product logo (light theme) located at the left of the top navigation bar
        public readonly productLogoLightURL: string,
        // The URL of the product logo (dark theme) located at the left of the top navigation bar
        public readonly productLogoDarkURL: string,
        // The URL of the reduced product logo (light theme) located at the left of the top navigation bar
        public readonly productMiniLogoLightURL: string | null,
        // The URL of the reduced product logo (dark theme) located at the left of the top navigation bar
        public readonly productMiniLogoDarkURL: string | null,
        // The prefix used in the document title
        public readonly documentTitlePrefix: string,
        // The description of the product as shown in the long form of the footer tagline
        public readonly productDescription: string,
        // The content of meta tag: name="description"
        public readonly metaDescription: string | null,
        // The content of meta tag: property="og:url"
        public readonly metaURL: string | null,
        // The URL of the 'BUILT ON' logo (light theme) located at the left of the footer
        public readonly builtOnLogoLightURL: string,
        // The URL of the 'BUILT ON' logo (dark theme) located at the left of the footer
        public readonly builtOnLogoDarkURL: string,
        // The URL to which a click on the bottom-left 'BUILT ON' logo will navigate
        public readonly builtOnURL: string | null,
        // The URL of the sponsor logo (light theme) located at the right of the footer
        public readonly sponsorLogoLightURL: string,
        // The URL of the sponsor logo (dark theme) located at the right of the footer
        public readonly sponsorLogoDarkURL: string,
        // The URL to which a click on the bottom-right sponsor logo will navigate
        public readonly sponsorURL: string | null,
        // The URL of the 'Terms of Use' page
        public readonly termsOfUseURL: string | null,
        // The HTML content of the disclaimer notice displayed on the Rewards Estimator
        public readonly estimatorNotice: string | null, // Unused when enabledStaking is false

        // The HTML content of the disclaimer popup dialog displayed by the Wallet Chooser
        public readonly walletChooserDisclaimerPopup: string | null,
        // Global site tag ID for Google Analytics
        public readonly googleTagID: string | null,
        // The HTML content of the cookie acceptation dialog
        public readonly cookiesDialogContent: string | null,
        // The URL of the IPFS gateway
        public readonly ipfsGatewayURL: string | null,
        // The URL of the Arweave server
        public readonly arweaveServerURL: string | null,
        // The HTML content used as crypto unit symbol
        public readonly cryptoName: string,
        // The HTML content used as crypto unit symbol
        public readonly cryptoSymbol: string | null,
        // The URL of the crypto logo (light theme)
        public readonly cryptoLogoLightURL: string,
        // The URL of the crypto logo (dark theme)
        public readonly cryptoLogoDarkURL: string,
        // The Wallect Connect Identifier
        public readonly walletConnectID: string | null,
        // The key for accessing Hgraph data
        public readonly hgraphKey: string | null,

        // The URL of Hiero Explorer Backend service
        public readonly explorerBackendURL: string | null,
    ) {
    }

    private static parse(obj: Record<string, unknown>): CoreConfig {
        return new CoreConfig(
            fetchString(obj, "productName") ?? "Hiero Explorer",
            fetchURL(obj, "productLogoLightURL") ?? localPathToURL("product-logo-light.png") ,
            fetchURL(obj, "productLogoDarkURL") ?? localPathToURL("product-logo-dark.png"),
            fetchURL(obj, "productMiniLogoLightURL"),
            fetchURL(obj, "productMiniLogoDarkURL"),
            fetchString(obj, "documentTitlePrefix") ?? "Hiero",
            fetchString(obj, "productDescription") ?? "Hiero Explorer is a ledger explorer for the Hiero network.",
            fetchString(obj, "metaDescription"),
            fetchURL(obj, "metaURL"),
            fetchURL(obj, "builtOnLogoLightURL") ?? localPathToURL("technology-logo-light.svg"),
            fetchURL(obj, "builtOnLogoDarkURL") ?? localPathToURL("technology-logo-dark.svg") ,
            fetchURL(obj, "builtOnURL"),
            fetchURL(obj, "sponsorLogoLightURL") ?? localPathToURL("sponsor-logo-light.png"),
            fetchURL(obj, "sponsorLogoDarkURL") ?? localPathToURL("sponsor-logo-dark.png"),
            fetchURL(obj, "sponsorURL"),
            fetchURL(obj, "termsOfUseURL"),
            fetchString(obj, "estimatorNotice"),
            fetchString(obj, "walletChooserDisclaimerPopup"),
            fetchString(obj, "googleTagID"),
            fetchString(obj, "cookiesDialogContent"),
            fetchURL(obj, "ipfsGatewayURL") ?? "https://gateway.pinata.cloud/ipfs/",
            fetchURL(obj, "arweaveServerURL") ?? "https://arweave.net/",
            fetchString(obj, "cryptoName") ?? "HBAR",
            fetchString(obj, "cryptoSymbol"),
            fetchURL(obj, "cryptoLogoLightURL") ?? localPathToURL("crypto-logo-light.svg"),
            fetchURL(obj, "cryptoLogoDarkURL") ?? localPathToURL("crypto-logo-dark.svg"),
            fetchString(obj, "walletConnectID"),
            fetchString(obj, "hgraphKey"),
            fetchURL(obj, "explorerBackendURL"),
        )
    }
}

