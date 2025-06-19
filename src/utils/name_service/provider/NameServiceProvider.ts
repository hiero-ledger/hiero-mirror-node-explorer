// SPDX-License-Identifier: Apache-2.0

export abstract class NameServiceProvider {

    //
    // Public
    //


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async resolve(name: string, network: string): Promise<string | null> {
        throw "must be subclassed"
    }


    //
    // Protected
    //

    protected constructor(
        public readonly providerAlias: string,
        public readonly providerDisplayName: string,
        public readonly providerHomeURL: string | null) {
    }
}
