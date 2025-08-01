// SPDX-License-Identifier: Apache-2.0

import {Ref} from "vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {EntityDownloader} from "@/utils/downloader/EntityDownloader.ts";

export abstract class DownloadController<E, R> extends TaskController {

    //
    // Public
    //

    protected constructor(showDialog: Ref<boolean>) {
        super(showDialog)
    }

    //
    // To be subclassed
    //

    public abstract getDownloader(): EntityDownloader<E, R>

    //
    // TaskController
    //

    public async execute(): Promise<void> {
        await this.getDownloader().run()
    }

}
