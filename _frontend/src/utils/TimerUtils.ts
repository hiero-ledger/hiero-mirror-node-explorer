// SPDX-License-Identifier: Apache-2.0

// Wraps window.setTimeout() in an async function
export async function waitFor(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function abortableWaitFor(milliseconds: number, signal: AbortSignal): Promise<void> {
    return new Promise(resolve => {
        if (signal.aborted) {
            resolve()
        } else {
            const handleTimeout = () => {
                signal.removeEventListener( "abort", handleAbort );
                resolve()
            }
            const handleAbort = () => {
                clearTimeout(timeoutID);
                handleTimeout()
            }
            const timeoutID = setTimeout(handleTimeout, milliseconds)
            signal.addEventListener( "abort", handleAbort);
        }
    })
}
