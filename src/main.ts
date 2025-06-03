// SPDX-License-Identifier: Apache-2.0

import {createApp} from 'vue'
import Root from './Root.vue'
import axios from 'axios'
import {OrugaConfig} from '@oruga-ui/oruga-next'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faForward} from "@fortawesome/free-solid-svg-icons";

import "@/styles/explorer.css";
import {AxiosMonitor} from "@/utils/AxiosMonitor";
import {CoreConfig} from "@/config/CoreConfig";
import {NetworkConfig} from "@/config/NetworkConfig";
import router, {routeManager} from "@/utils/RouteManager.ts";

library.add(faForward);
export default FontAwesomeIcon;

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
    app.component("font-awesome-icon", FontAwesomeIcon)
    app.use(router)
    app.use(OrugaConfig, {iconPack: 'fas'})
    app.mount('#app')
}

(async () => createAndMount())()

