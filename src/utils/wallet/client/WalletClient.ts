// SPDX-License-Identifier: Apache-2.0

import {ContractResultDetails, KeyType} from "@/schemas/MirrorNodeSchemas";
import {EIP1193Provider} from "@/utils/wallet/eip1193";
import {PublicKey} from "@hashgraph/sdk";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache.ts";

export abstract class WalletClient {

    //
    // Public
    //

    public constructor(
        protected readonly accountId: string,
        protected readonly publicKey: PublicKey,
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


export async function getPublicKey(accountId: string): Promise<PublicKey|null> {
    let result: PublicKey|null
    const accountInfo = await AccountByIdCache.instance.lookup(accountId)
    switch(accountInfo?.key?._type) {
        case KeyType.ED25519:
            result = PublicKey.fromStringED25519(accountInfo.key.key)
            break
        case KeyType.ECDSA_SECP256K1:
            result = PublicKey.fromStringECDSA(accountInfo.key.key)
            break
        default:
            result = null
            break
    }
    return Promise.resolve(result)
}
