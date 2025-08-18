// SPDX-License-Identifier: Apache-2.0


import {Ref} from "vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {ProfileController} from "@/utils/profile/ProfileController.ts";
import {EmailTextFieldController, EmailTextFieldState} from "@/dialogs/common/EmailTextFieldController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";

export class SignInController extends TaskController {

    public readonly emailController: EmailTextFieldController

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>,
                       private readonly profileController: ProfileController,
                       private readonly routeManager: RouteManager) {
        super(showDialog)
        this.emailController = new EmailTextFieldController()
    }

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        return this.emailController.state.value === EmailTextFieldState.ok
    }

    public async execute(): Promise<void> {
        const email = this.emailController.newEmail.value
        if (email !== null) {
            await this.profileController.connect(email, "secret")
            await this.routeManager.routeToProfile(null)
        }
    }

}
