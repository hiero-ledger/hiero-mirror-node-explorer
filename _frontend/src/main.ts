// SPDX-License-Identifier: Apache-2.0

import {createApp} from 'vue'
import Root from './Root.vue'
import axios from 'axios'
import {createOruga} from '@oruga-ui/oruga-next'

import "@oruga-ui/theme-oruga/style.css";
import "@/styles/explorer.css";
import {AxiosMonitor} from "@/utils/AxiosMonitor";
import {CoreConfig} from "@/config/CoreConfig";
import {NetworkConfig} from "@/config/NetworkConfig";
import router, {routeManager} from "@/utils/RouteManager.ts";
import OrugaLucideIcon from "@/components/OrugaLucideIcon.vue";

AxiosMonitor.instance.setTargetAxios(axios)

const loadCoreConfig = async () => {
    let result: CoreConfig | unknown
    const coreConfigURL = window.location.origin + '/core-config.json'
    try {
        result = await CoreConfig.load(coreConfigURL)
    } catch (error) {
        result = error
    }
    return result
}

const loadNetworkConfig = async () => {
    let result: NetworkConfig | unknown
    const url = window.location.origin + '/networks-config.json'
    try {
        result = await NetworkConfig.load(url)
    } catch (error) {
        result = error
    }
    return result
}

const createAndMount = async () => {
    const coreConfig = await loadCoreConfig()
    const networkConfig = await loadNetworkConfig()
    if (coreConfig instanceof CoreConfig && networkConfig instanceof NetworkConfig) {
        routeManager.configure(coreConfig, networkConfig)
    }

    const cssId = 'customCss';  // you could encode the css path itself to generate id..
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/style-config.css';
    link.media = 'all';
    head.appendChild(link);

    const app = createApp(Root, {coreConfig, networkConfig})

    app.component("oruga-lucide-icon", OrugaLucideIcon)
    app.use(router)
    app.use(createOruga({
        iconPack: 'basicCustomPack',
        iconComponent: 'oruga-lucide-icon',
        customIconPacks: {
            basicCustomPack: {
                iconPrefix: '',
                sizes: {
                    default: "24",
                    small: "16",
                    medium: "24",
                    large: "32",
                }
            }
        }
    }))
    app.mount('#app')
}

(async () => createAndMount())()

