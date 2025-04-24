// SPDX-License-Identifier: Apache-2.0

import {ContractResultDetails} from "@/schemas/MirrorNodeSchemas";
import {EIP1193Provider} from "@/utils/wallet/eip1193";

export abstract class WalletClient {

    //
    // Public
    //

    public constructor(
        protected readonly accountId: string,
        protected readonly network: string,
        protected readonly provider: EIP1193Provider) {
    }


    public async associateToken(tokenId: string): Promise<string> {
        throw "to be implemented"
    }


    public async dissociateToken(tokenId: string): Promise<string> {
        throw "to be implemented"
    }


    public async callContract(contractId: string, functionData: string, value: string|null): Promise<ContractResultDetails | string> {
        throw "to be implemented"
    }


}

export class WalletClientError extends Error {

    public readonly extra: string

    public constructor(message: string, extra: string) {
        super(message)
        this.extra = extra
    }
}

export class WalletClientRejectError extends WalletClientError {

    public constructor() {
        super("User rejected operation ", "")
    }
}

export class WalletClientSetupRequiredError extends WalletClientError {

    public constructor() {
        super("Wallet requires some setup", "")
    }
}
