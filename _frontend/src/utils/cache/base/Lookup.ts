// SPDX-License-Identifier: Apache-2.0

import {Ref} from "vue";

export interface Lookup<E> {
    readonly entity: Ref<E | null>

    mount(): void

    unmount(): void
}
