// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, watch} from "vue";
import {routeManager} from "@/router.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {EntityID} from "@/utils/EntityID.ts";
import {BaseTextFieldController} from "@/dialogs/common/BaseTextFieldController.ts"
import {extractChecksum, stripChecksum} from "@/schemas/MirrorNodeUtils.ts";

export class EntityTextFieldController {

    public readonly oldEntityId: Ref<string | null>
    public readonly inputText: Ref<string>
    private readonly networkConfig: NetworkConfig
    private readonly baseTextFieldController: BaseTextFieldController

    //
    // Public
    //

    public constructor(oldEntityId: Ref<string | null>, networkConfig: NetworkConfig) {

        this.oldEntityId = oldEntityId
        this.baseTextFieldController = new BaseTextFieldController(oldEntityId)
        this.inputText = this.baseTextFieldController.inputText
        this.networkConfig = networkConfig

        watch(this.newEntityId, () => {
            if (this.newEntityId.value !== null) {
                this.inputText.value = this.newEntityId.value
            }
        })
    }

    public readonly state = computed(() => {
        let result: EntityTextFieldState
        const trimmedValue = this.baseTextFieldController.newText.value.trim()
        if (trimmedValue !== "") {
            const entityID = this.parseEntityID(trimmedValue)
            if (entityID !== null) {
                const checksum = extractChecksum(trimmedValue)
                const network = routeManager.currentNetwork.value
                if (checksum === null || this.networkConfig.isValidChecksum(entityID.toString(), checksum, network)) {
                    result = EntityTextFieldState.ok
                } else {
                    result = EntityTextFieldState.invalidChecksum
                }
            } else {
                result = EntityTextFieldState.invalidSyntax
            }
        } else {
            result = EntityTextFieldState.empty
        }
        return result
    })

    public readonly newEntityId = computed(() => {
        let result: string | null
        const trimmedValue = this.baseTextFieldController.newText.value.trim()
        if (trimmedValue !== "") {
            const entityID = this.parseEntityID(trimmedValue)
            result = entityID?.toString() ?? null
        } else {
            result = null
        }
        return result
    })

    private parseEntityID(textValue: string): EntityID | null {
        let result: EntityID | null
        const baseRealm = routeManager.currentNetworkEntry.value.baseRealm
        const baseShard = routeManager.currentNetworkEntry.value.baseShard
        const strippedValue = stripChecksum(textValue)
        result = EntityID.parse(strippedValue)
        if (result === null) {
            const positiveInt = EntityID.parsePositiveInt(strippedValue)
            if (positiveInt !== null) {
                result = new EntityID(baseShard, baseRealm, positiveInt, null)
            }
        }
        return result
    }
}

export enum EntityTextFieldState {
    empty,
    invalidSyntax, // Invalid entity id syntax
    invalidChecksum, // Checksum does not match
    ok
}
