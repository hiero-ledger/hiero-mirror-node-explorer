// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module 'primjs';
