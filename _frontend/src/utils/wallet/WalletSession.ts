// SPDX-License-Identifier: Apache-2.0


import {WalletClient} from "@/utils/wallet/client/WalletClient";

export abstract class WalletSession {


    //
    // Public
    //


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async makeClient(accountId: string): Promise<WalletClient | null> {
        throw "to be implemented"
    }

    public async revoke(): Promise<void> {
        throw "to be implemented"
    }

    public abstract getWalletDN(): string

    public abstract getWalletUUID(): string | null

    //
    // Protected
    //

    protected constructor(public readonly name: string,
                          public readonly iconURL: string | null,
                          public readonly usableAccountIds: string[],
                          public readonly otherAccountIds: string[]) {
    }


}
