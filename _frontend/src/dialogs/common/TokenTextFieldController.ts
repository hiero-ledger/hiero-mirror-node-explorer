// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TokenInfo, TokenRelationship} from "@/schemas/MirrorNodeSchemas.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {EntityTextFieldController, EntityTextFieldState} from "@/dialogs/common/EntityTextFieldController.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {TokenAssociationCache} from "@/utils/cache/TokenAssociationCache.ts";

export class TokenTextFieldController {

    public readonly oldTokenId: Ref<string | null>
    public readonly accountId: Ref<string | null>
    public readonly inputText: Ref<string>
    private readonly entityFieldController: EntityTextFieldController
    private readonly tokenLookup: EntityLookup<string, TokenInfo | null>
    private readonly tokenAssociationLookup: EntityLookup<string, TokenRelationship[] | null>

    //
    // Public
    //

    public constructor(oldTokenId: Ref<string | null>, accountId: Ref<string | null>, networkConfig: NetworkConfig) {
        this.oldTokenId = oldTokenId
        this.accountId = accountId
        this.entityFieldController = new EntityTextFieldController(this.oldTokenId, networkConfig)
        this.inputText = this.entityFieldController.inputText
        this.tokenLookup = TokenInfoCache.instance.makeLookup(this.newTokenId)
        this.tokenAssociationLookup = TokenAssociationCache.instance.makeTokenAssociationLookup(this.accountId, this.newTokenId)
    }

    public mount(): void {
        this.tokenLookup.mount()
        this.tokenAssociationLookup.mount()
    }

    public unmount(): void {
        this.tokenLookup.unmount()
        this.tokenAssociationLookup.unmount()
    }

    public readonly state = computed(() => {
        let result: TokenTextFieldState
        switch (this.entityFieldController.state.value) {
            case EntityTextFieldState.empty:
                result = TokenTextFieldState.empty
                break
            case EntityTextFieldState.invalidSyntax:
                result = TokenTextFieldState.invalid
                break
            case EntityTextFieldState.invalidChecksum:
                result = TokenTextFieldState.invalidChecksum
                break
            default:
            case EntityTextFieldState.ok:
                result = TokenTextFieldState.ok
                break
        }
        return result
    })

    public readonly newTokenId = computed(() => this.entityFieldController.newEntityId.value)

    public readonly newTokenInfo = computed(() => this.tokenLookup.entity.value)

    public readonly isLoaded = computed(() => this.tokenLookup.isLoaded.value)

    public readonly isTokenAssociationLoaded = computed(() => this.tokenAssociationLookup.isLoaded.value)

    public readonly isTokenAssociated = computed(() => {
        const associations = this.tokenAssociationLookup.entity.value ?? []
        return associations && associations.length >= 1
    })
}


export enum TokenTextFieldState {
    empty,
    invalid, // Invalid entity id syntax
    invalidChecksum, // Checksum does not match
    ok
}
