// SPDX-License-Identifier: Apache-2.0

import {inject, ref} from "vue";
import {waitFor} from "@/utils/TimerUtils.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {profileControllerKey, themeControllerKey} from "@/AppKeys.ts";

export class ProfileController {

    public readonly coreConfig: CoreConfig

    //
    // Public
    //

    public constructor(coreConfig: CoreConfig) {
        this.coreConfig = coreConfig
    }

    public readonly connectionStatus
        = ref<ProfileConnectionStatus>(ProfileConnectionStatus.Disconnected)

    public async connect(password: string): Promise<void> {
        this.connectionStatus.value = ProfileConnectionStatus.Connecting
        await waitFor(2000)
        this.connectionStatus.value = ProfileConnectionStatus.Connected
    }

    public async disconnect(): Promise<void> {
        this.connectionStatus.value = ProfileConnectionStatus.Disconnected
    }


    public static inject(): ProfileController {
        const defaultFactory = () => new ProfileController(CoreConfig.FALLBACK)
        return inject<ProfileController>(profileControllerKey, defaultFactory, true)
    }

}

export enum ProfileConnectionStatus {
    Disconnected,
    Connecting,
    Connected
}
