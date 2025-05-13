// SPDX-License-Identifier: Apache-2.0

import {computed, inject, ref} from "vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {Portal} from "@/utils/profile/Portal.ts";
import {profileControllerKey} from "@/AppKeys.ts";

export class ProfileController {

    public readonly coreConfig: CoreConfig
    public readonly portalClient: Portal.Client|null
    private readonly connecting = ref<boolean>(false)
    private readonly disconnecting = ref<boolean>(false)

    //
    // Public
    //

    public constructor(coreConfig: CoreConfig) {
        this.coreConfig = coreConfig
        this.portalClient = coreConfig.portalURL !== null ? new Portal.Client(coreConfig.portalURL) : null
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
                this.session.value = null
                this.disconnecting.value = false
            }
        }
    }

    public static inject(): ProfileController {
        const defaultFactory = () => new ProfileController(CoreConfig.FALLBACK)
        return inject<ProfileController>(profileControllerKey, defaultFactory, true)
    }
}

export enum ProfileConnectionStatus {
    Disabled,
    Disconnecting,
    Disconnected,
    Connecting,
    Connected
}
