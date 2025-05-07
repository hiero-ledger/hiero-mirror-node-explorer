// SPDX-License-Identifier: Apache-2.0

/// <reference types = "grecaptcha" />

export async function fetchReCaptchaToken(siteKey: string, container: string|HTMLElement, action: string): Promise<string> {

    await loadReCaptcha()

    return new Promise((resolve/*, reject*/) => {
        grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.render(container, {
                sitekey: siteKey,
                action: action,
                callback(token: string) {
                    resolve(token)
                },
            });
        });
    })
}

async function loadReCaptcha(): Promise<void> {

    // https://developers.google.com/recaptcha/docs/loading

    return new Promise((resolve /*, reject */) => {
        const RECAPTCHA_SCRIPT_ID = "recaptcha"
        const head = document.getElementsByTagName('head')[0];
        let script = document.getElementById(RECAPTCHA_SCRIPT_ID)
        if (script === null) {
            const w = window  as { [key: string]: any }
            const onLoadCallback = "onLoadCallback"
            w[onLoadCallback] = resolve
            const script = document.createElement('script')
            script.id = RECAPTCHA_SCRIPT_ID
            script.type = "text/javascript"
            script.src = "https://www.google.com/recaptcha/enterprise.js?onload=" + onLoadCallback
            script.async = true
            head.appendChild(script);
        } else {
            resolve()
        }
    })

}
