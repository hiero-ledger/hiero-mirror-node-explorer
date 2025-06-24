// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref} from "vue";
import {Portal} from "@/utils/profile/Portal.ts";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {EntityTextFieldController, EntityTextFieldState} from "@/dialogs/common/EntityTextFieldController.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {ProfileController} from "@/utils/profile/ProfileController.ts";
import {BlockByNbCache} from "@/utils/cache/BlockByNbCache.ts";
import {EntityAnalyzer, EntityReportType} from "@/utils/analyzer/EntityAnalyzer.ts";
import {makePublicKeyDER} from "@/schemas/MirrorNodeUtils.ts";
import {routeManager} from "@/utils/RouteManager.ts";

export class EditBookmarkController extends TaskController {

    public readonly entityIdInputText: Ref<string>
    public readonly nameInputText = ref<string>("")
    public readonly typeInputText = ref<string>("")
    public readonly descriptionInputText = ref<string>("")
    public readonly websiteInputText = ref<string>("")

    private readonly entityIdController: EntityTextFieldController
    private readonly entityAnalyzer: EntityAnalyzer

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>,
                       networkConfig: NetworkConfig,
                       private readonly profileController: ProfileController,
                       private readonly entityId: Ref<string|null>) {
        super(showDialog)
        this.entityIdController = new EntityTextFieldController(entityId, networkConfig)
        this.entityAnalyzer = new EntityAnalyzer(this.entityIdController.newEntityId)
        this.entityIdInputText = this.entityIdController.inputText
    }

    public readonly oldEntityBookmark = computed(() => {
        let result: Portal.EntityBookmark|null
        if (this.entityId.value !== null) {
            result = this.profileController.findBookmark(this.entityId.value)
        } else {
            result = null
        }
        return result
    })

    public readonly feedbackMessage = computed(
        () => this.entityIdFeedbackMessage.value
            ?? this.nameFeedbackMessage.value
            ?? this.typeFeedbackMessage.value
            ?? this.descriptionFeedbackMessage.value
            ?? this.websiteFeedbackMessage.value
    )

    public readonly entityReportType = computed(() => this.entityAnalyzer.entityType.value)

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        return this.isValid.value && this.isEdited.value
    }

    public async execute(): Promise<void> {

        const block0 = await BlockByNbCache.instance.lookup(0)
        const epoch = block0?.timestamp?.from ?? "0.0"
        const entityReport = this.entityAnalyzer.report.value!

        let publicKey: string|null
        if (entityReport.entityType === EntityReportType.Account) {
            publicKey = makePublicKeyDER(entityReport.accountInfo!)
        } else {
            publicKey = null
        }

        const newBookmark: Portal.NewEntityBookmark = {
            name: this.nameInputText.value,
            bookmarkType: this.typeInputText.value,
            description: this.descriptionInputText.value,
            website: this.websiteInputText.value,
            networkEpoch: epoch,
            entityType: convertToPortalEntityType(entityReport.entityType)!,
            publicKey: publicKey
        }

        const network = routeManager.currentNetwork.value
        const entityId = this.entityAnalyzer.entityId.value!

        await this.profileController.writeBookmark(network, entityId, newBookmark)
    }

    public dialogStartShowing(): void {
        const existing = this.oldEntityBookmark.value
        this.entityIdInputText.value = existing?.entityId ?? this.entityIdInputText.value
        this.nameInputText.value = existing?.name ?? "Nice bookmark"
        this.typeInputText.value = existing?.bookmarkType ?? ""
        this.descriptionInputText.value = existing?.description ?? ""
        this.websiteInputText.value = existing?.website ?? ""

        this.entityAnalyzer.mount()
    }

    public dialogStopShowing(): void {
        this.entityAnalyzer.unmount()
    }

    //
    // Private
    //

    private readonly isValid = computed(() => {
        let result = true
        result = result && this.entityIdValid.value
        result = result && this.nameValid.value
        result = result && this.typeValid.value
        result = result && this.descriptionValid.value
        result = result && this.websiteValid.value
        return result
    })

    private readonly isEdited = computed(() => {
        let result = false
        result = result || this.entityIdEdited.value
        result = result || this.nameEdited.value
        result = result || this.typeEdited.value
        result = result || this.descriptionEdited.value
        result = result || this.websiteEdited.value
        return result
    })

    //
    // Private (entity id)
    //

    private readonly entityIdValid = computed(() => {
        let result: boolean
        switch (this.entityIdController.state.value) {
            default:
            case EntityTextFieldState.empty:
            case EntityTextFieldState.invalidSyntax:
            case EntityTextFieldState.invalidChecksum:
                result = false
                break
            case EntityTextFieldState.ok:
                if (this.entityId.value !== null) {
                    if (this.entityAnalyzer.report.value !== null) {
                        result = this.entityAnalyzer.report.value.entityType !== EntityReportType.NotFound
                    } else {
                        result = false
                    }
                } else {
                    const inputEntityId = this.entityIdController.newEntityId.value!
                   result = this.profileController.findBookmark(inputEntityId) === null
                }
                break
        }
        if (this.entityId.value !== null) {
            // Dialog disables entity id editing
            result = true
        } else {
            const inputEntityId = this.entityIdController.newEntityId.value
            if (inputEntityId === null) {
                // Entity field is empty or invalid
                result = false
            } else {
                // Check if there is no conflicting bookmark
                result = this.profileController.findBookmark(inputEntityId) === null
            }
        }
        return result
    })

    private readonly entityIdEdited = computed(
        () => this.entityId.value === null)

    private readonly entityIdFeedbackMessage = computed(() => {
        let result: string|null
        switch (this.entityIdController.state.value) {
            default:
            case EntityTextFieldState.empty:
                result = null
                break
            case EntityTextFieldState.invalidSyntax:
                result = "Invalid entity id syntax"
                break
            case EntityTextFieldState.invalidChecksum:
                result = "Invalid entity checksum"
                break
            case EntityTextFieldState.ok:
                if (this.entityId.value !== null) {
                    result = null
                } else {
                    const entityReport = this.entityAnalyzer.report.value
                    if (entityReport === null) {
                        result = null
                    } else if (entityReport.entityType == EntityReportType.NotFound) {
                        result = this.entityAnalyzer.entityId.value + " does not exist"
                    } else {
                        const inputEntityId = this.entityAnalyzer.entityId.value!
                        const existing = this.profileController.findBookmark(inputEntityId)
                        if (existing !== null) {
                            result = existing.entityId + " is already bookmarked as \"" + existing.name + "\""
                        } else {
                            result = null
                        }
                    }
                }
                break
        }
        return result
    })


    //
    // Private (name)
    //

    private readonly nameMaxLength = 35

    private readonly nameValid = computed(
        () => this.nameInputText.value.length <= this.nameMaxLength)

    private readonly nameEdited = computed(
        () => this.oldEntityBookmark.value === null
            || this.oldEntityBookmark.value.name != this.nameInputText.value)

    private readonly nameFeedbackMessage = computed(() => {
        let result: string|null
        if (this.nameValid.value) {
            result = null
        } else {
            result =  "Name should be " + this.nameMaxLength + " chars max"
        }
        return result
    })

    //
    // Private (type)
    //

    private readonly typeMaxLength = 35

    private readonly typeValid = computed(
        () => this.typeInputText.value.length <= this.typeMaxLength)

    private readonly typeEdited = computed(
        () => this.oldEntityBookmark.value === null
            || this.oldEntityBookmark.value.bookmarkType != this.typeInputText.value)

    private readonly typeFeedbackMessage = computed(() => {
        let result: string|null
        if (this.typeValid.value) {
            result = null
        } else {
            result = "Type should be " + this.typeMaxLength + " chars max"
        }
        return result
    })

    //
    // Private (description)
    //

    private readonly descriptionMaxLength = 5000

    private readonly descriptionValid = computed(
        () => this.descriptionInputText.value.length <= this.descriptionMaxLength)

    private readonly descriptionEdited = computed(
        () => this.oldEntityBookmark.value === null
            || this.oldEntityBookmark.value.description != this.descriptionInputText.value)

    private readonly descriptionFeedbackMessage = computed(() => {
        let result: string|null
        if (this.descriptionValid.value) {
            result = null
        } else {
            result = "Description should be " + this.descriptionMaxLength + " chars max"
        }
        return result
    })

    //
    // Private (website)
    //

    private readonly websiteMaxLength = 2000

    private readonly websiteValid = computed(() => this.websiteInputText.value.length <= this.websiteMaxLength)

    private readonly websiteEdited = computed(
        () => this.oldEntityBookmark.value === null
               || this.oldEntityBookmark.value.website != this.websiteInputText.value)

    private readonly websiteFeedbackMessage = computed(() => {
        let result: string|null
        if (this.websiteValid.value) {
            result = null
        } else {
            result = "Website should be " + this.websiteMaxLength + " chars max"
        }
        return result
    })

}

function convertToPortalEntityType(entityReportType: EntityReportType): string|null {
    let result: string|null
    switch(entityReportType) {
        case EntityReportType.Account:
            result = "account"
            break
        case EntityReportType.Contract:
            result = "contract"
            break
        case EntityReportType.Token:
            result = "token"
            break
        case EntityReportType.Topic:
            result = "topic"
            break
        default:
        case EntityReportType.NotFound:
            result = null
    }
    return result
}
