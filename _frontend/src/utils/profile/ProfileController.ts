// SPDX-License-Identifier: Apache-2.0

import {computed, inject, ref} from "vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {BackendClient} from "@/utils/profile/BackendClient.ts";
import {profileControllerKey} from "@/AppKeys.ts";
import {User} from "@common/user/User.ts";

export class ProfileController {

    public readonly coreConfig: CoreConfig
    private readonly backendClient: BackendClient|null
    private readonly connecting = ref<boolean>(false)
    private readonly disconnecting = ref<boolean>(false)

    //
    // Public
    //

    public constructor(coreConfig: CoreConfig) {
        this.coreConfig = coreConfig
        this.backendClient = coreConfig.explorerBackendURL !== null ? new BackendClient(coreConfig.explorerBackendURL) : null
        // watch([this.session, this.portalNetwork], this.updateAccounts)
        // watch([this.session, routeManager.currentNetwork], this.updateBookmarks)
    }

    public readonly connectionStatus = computed(() => {
        let result: ProfileConnectionStatus
        if (this.backendClient === null) {
            result = ProfileConnectionStatus.Disabled
        } else if (this.connecting.value) {
            result = ProfileConnectionStatus.Connecting
        } else if (this.disconnecting.value) {
            result = ProfileConnectionStatus.Disconnecting
        } else if (this.currentUser.value !== null) {
            result = ProfileConnectionStatus.Connected
        } else {
            result = ProfileConnectionStatus.Disconnected
        }
        return result
    })

    public readonly currentUser
        = ref<User|null>(null)

    //
    // public readonly bookmarks
    //     = ref<Portal.EntityBookmark[]>([])

    public async restoreCurrentUser(): Promise<void> {
        if (this.backendClient !== null) {
            this.connecting.value = true
            try {
                this.currentUser.value = await this.backendClient.fetchCurrentUser()
                // const bookmarks = await this.backendClient.listEntityBookmarks("testnet")
            } catch(reason) {
                this.currentUser.value = null
            } finally {
                this.connecting.value = false
            }
        }
    }

    public async connect(email: string, password: string): Promise<void> {
        if (this.backendClient !== null) {
            this.connecting.value = true
            try {
                this.currentUser.value = await this.backendClient.signIn(email, password)
            } catch(reason) {
                this.currentUser.value = null
            } finally {
                this.connecting.value = false
            }
        }
    }

    public async disconnect(): Promise<void> {
        if (this.backendClient !== null) {
            this.disconnecting.value = true
            try {
                await this.backendClient.signOut()
            } finally {
                this.currentUser.value = null // => clears this.accounts and this.bookmarks
                this.disconnecting.value = false
            }
        }
    }
    //
    // public async writeBookmark(network: string, entityId: string, newBookmark: Portal.NewEntityBookmark): Promise<void> {
    //     if (this.backendClient !== null) {
    //         try {
    //             await this.backendClient.writeBookmark(network, entityId, newBookmark)
    //         } finally {
    //             await this.updateBookmarks()
    //         }
    //     }
    // }
    //
    // public async clearBookmark(network: string, entityId: string): Promise<void> {
    //     if (this.backendClient !== null) {
    //         try {
    //             await this.backendClient.clearBookmark(network, entityId)
    //         } finally {
    //             await this.updateBookmarks()
    //         }
    //     }
    // }
    //
    // public findBookmark(entityId: string): Portal.EntityBookmark|null {
    //     return this.bookmarks.value.find((b) => b.entityId == entityId) ?? null
    // }

    public static inject(): ProfileController {
        const defaultFactory = () => new ProfileController(CoreConfig.FALLBACK)
        return inject<ProfileController>(profileControllerKey, defaultFactory, true)
    }

    //
    // Private
    //

    //
    // private readonly updateBookmarks = async(): Promise<void> => {
    //     if (this.backendClient !== null && this.session.value !== null) {
    //         const network = routeManager.currentNetwork.value
    //         this.bookmarks.value = await this.backendClient.listEntityBookmarks(network) ?? []
    //     } else {
    //         this.bookmarks.value = []
    //     }
    // }
    //
    // private readonly portalNetwork = computed(() => {
    //     let result: Portal.AccountNetwork|null
    //     switch(routeManager.currentNetwork.value) {
    //         default:
    //         case "mainnet":
    //             result = null
    //             break
    //         case "testnet":
    //             result = Portal.AccountNetwork.Testnet
    //             break
    //         case "previewnet":
    //             result = Portal.AccountNetwork.Previewnet
    //             break
    //     }
    //     return result
    // })
}

export enum ProfileConnectionStatus {
    Disabled,
    Disconnecting,
    Disconnected,
    Connecting,
    Connected
}
