// SPDX-License-Identifier: Apache-2.0

import {computed, inject, ref, watch} from "vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {Portal} from "@/utils/profile/Portal.ts";
import {profileControllerKey} from "@/AppKeys.ts";
import {routeManager} from "@/utils/RouteManager.ts";

export class ProfileController {

    public readonly coreConfig: CoreConfig
    private readonly portalClient: Portal.Client|null
    private readonly connecting = ref<boolean>(false)
    private readonly disconnecting = ref<boolean>(false)

    //
    // Public
    //

    public constructor(coreConfig: CoreConfig) {
        this.coreConfig = coreConfig
        this.portalClient = coreConfig.portalURL !== null ? new Portal.Client(coreConfig.portalURL) : null
        watch([this.session, this.portalNetwork], this.updateAccounts)
        watch([this.session, routeManager.currentNetwork], this.updateBookmarks)
    }

    public readonly connectionStatus = computed(() => {
        let result: ProfileConnectionStatus
        if (this.portalClient === null) {
            result = ProfileConnectionStatus.Disabled
        } else if (this.connecting.value) {
            result = ProfileConnectionStatus.Connecting
        } else if (this.disconnecting.value) {
            result = ProfileConnectionStatus.Disconnecting
        } else if (this.session.value !== null) {
            result = ProfileConnectionStatus.Connected
        } else {
            result = ProfileConnectionStatus.Disconnected
        }
        return result
    })

    public readonly session
        = ref<Portal.Session|null>(null)

    public readonly user
        = computed(() => this.session.value?.user ?? null)

    public readonly bookmarks
        = ref<Portal.EntityBookmark[]>([])

    public readonly accounts
        = ref<Portal.Account[]>([])

    public readonly ed25519Account = computed(() => {
        return this.accounts.value.find((a) => a.keyType == Portal.AccountKeyType.Ed25519) ?? null
    })

    public readonly ecdsaAccount = computed(() => {
        return this.accounts.value.find((a) => a.keyType == Portal.AccountKeyType.Ecdsa) ?? null
    })

    public readonly ed25519AccountId = computed(() => {
        const a = this.ed25519Account.value
        return  a !== null ? a.shard + "." + a.realm + "." + a.accountNum : null
    })

    public readonly ecdsaAccountId = computed(() => {
        const a = this.ecdsaAccount.value
        return  a !== null ? a.shard + "." + a.realm + "." + a.accountNum : null
    })

    public async restoreSession(): Promise<void> {
        if (this.portalClient !== null) {
            this.connecting.value = true
            try {
                this.session.value = await this.portalClient.fetchCurrentSession()
                const bookmarks = await this.portalClient.listEntityBookmarks("testnet")
                console.log(JSON.stringify(bookmarks, null, "  "))
            } catch(reason) {
                this.session.value = null
            } finally {
                this.connecting.value = false
            }
        }
    }

    public async connect(email: string, password: string, recaptchaToken: string): Promise<void> {
        if (this.portalClient !== null) {
            this.connecting.value = true
            try {
                this.session.value = await this.portalClient.createSession(email, password, recaptchaToken)
            } catch(reason) {
                this.session.value = null
            } finally {
                this.connecting.value = false
            }
        }
    }

    public async disconnect(): Promise<void> {
        if (this.portalClient !== null) {
            this.disconnecting.value = true
            try {
                await this.portalClient.destroyCurrentSession()
            } finally {
                this.session.value = null // => clears this.accounts and this.bookmarks
                this.disconnecting.value = false
            }
        }
    }

    public async writeBookmark(network: string, entityId: string, newBookmark: Portal.NewEntityBookmark): Promise<void> {
        if (this.portalClient !== null) {
            try {
                await this.portalClient.writeBookmark(network, entityId, newBookmark)
            } finally {
                await this.updateBookmarks()
            }
        }
    }

    public async clearBookmark(network: string, entityId: string): Promise<void> {
        if (this.portalClient !== null) {
            try {
                await this.portalClient.clearBookmark(network, entityId)
            } finally {
                await this.updateBookmarks()
            }
        }
    }

    public findBookmark(entityId: string): Portal.EntityBookmark|null {
        return this.bookmarks.value.find((b) => b.entityId == entityId) ?? null
    }

    public static inject(): ProfileController {
        const defaultFactory = () => new ProfileController(CoreConfig.FALLBACK)
        return inject<ProfileController>(profileControllerKey, defaultFactory, true)
    }

    //
    // Private
    //

    private readonly updateAccounts = async (): Promise<void> => {
        if (this.portalClient !== null && this.portalNetwork.value !== null && this.session.value !== null) {
            const all = await this.portalClient.listAccounts() ?? []
            this.accounts.value = all.filter((a) => a.network === this.portalNetwork.value)
        } else {
            this.accounts.value = []
        }
    }

    private readonly updateBookmarks = async(): Promise<void> => {
        if (this.portalClient !== null && this.session.value !== null) {
            const network = routeManager.currentNetwork.value
            this.bookmarks.value = await this.portalClient.listEntityBookmarks(network) ?? []
        } else {
            this.bookmarks.value = []
        }
    }

    private readonly portalNetwork = computed(() => {
        let result: Portal.AccountNetwork|null
        switch(routeManager.currentNetwork.value) {
            default:
            case "mainnet":
                result = null
                break
            case "testnet":
                result = Portal.AccountNetwork.Testnet
                break
            case "previewnet":
                result = Portal.AccountNetwork.Previewnet
                break
        }
        return result
    })
}

export enum ProfileConnectionStatus {
    Disabled,
    Disconnecting,
    Disconnected,
    Connecting,
    Connected
}
