// SPDX-License-Identifier: Apache-2.0


import {Ref} from "vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import {EmailTextFieldController, EmailTextFieldState} from "@/dialogs/common/EmailTextFieldController.ts";
import {BaseTextFieldController} from "@/dialogs/common/BaseTextFieldController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";
import {AppStorage} from "@/AppStorage.ts";

export class SignInController extends TaskController {

    public readonly emailController = new EmailTextFieldController()
    public readonly passwordController = new BaseTextFieldController()

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>,
                       private readonly profileController: ProfileController,
                       private readonly routeManager: RouteManager) {
        super(showDialog)

        const lastEmail = AppStorage.getSignInEmail()
        this.emailController.inputText.value = lastEmail ?? ""
    }

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        return this.emailController.state.value === EmailTextFieldState.ok
            && this.passwordController.newText.value.length > 0
    }

    public async execute(): Promise<void> {
        const email = this.emailController.newEmail.value
        const password = this.passwordController.newText.value
        if (email !== null) {
            await this.profileController.connect(email, password)
            if (this.profileController.connectionStatus.value == ProfileConnectionStatus.Connected) {
                await this.routeManager.routeToProfile(null)
                AppStorage.setSignInEmail(email)
            } else {
                throw new Error("Invalid email or password")
            }
        }
    }

}
