// SPDX-License-Identifier: Apache-2.0


import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {AccountByAliasCache} from "@/utils/cache/AccountByAliasCache";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";
import {AdminContractCache} from "@/utils/cache/AdminContractCache";
import {AssetCache} from "@/utils/cache/AssetCache";
import {BalanceCache} from "@/utils/cache/BalanceCache";
import {BlockByHashCache} from "@/utils/cache/BlockByHashCache";
import {BlockByNbCache} from "@/utils/cache/BlockByNbCache";
import {BlockByTsCache} from "@/utils/cache/BlockByTsCache";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";
import {ContractResultByHashCache} from "@/utils/cache/ContractResultByHashCache";
import {ContractResultByTransactionIdCache} from "@/utils/cache/ContractResultByTransactionIdCache";
import {ContractResultByTsCache} from "@/utils/cache/ContractResultByTsCache";
import {ContractResultsLogsByContractIdCache} from "@/utils/cache/ContractResultsLogsByContractIdCache"
import {ERC20Cache} from "@/utils/cache/ERC20Cache";
import {ERC20InfoCache} from "@/utils/cache/ERC20InfoCache.ts";
import {ERC721Cache} from "@/utils/cache/ERC721Cache.ts";
import {ERC721InfoCache} from "@/utils/cache/ERC721InfoCache.ts";
import {HCSAssetCache} from "@/utils/cache/HCSAssetCache.ts";
import {HbarPriceCache} from "@/utils/cache/HbarPriceCache";
import {LabelByIdCache} from "@/utils/cache/LabelByIdCache.ts";
import {LastTopicMessageByIdCache} from "@/utils/cache/LastTopicMessageByIdCache.ts";
import {LogicContractCache} from "@/utils/cache/LogicContractCache";
import {NetworkCache} from "@/utils/cache/NetworkCache";
import {NetworkFeesCache} from "@/utils/cache/NetworkFeesCache.ts";
import {NftBySerialCache} from "@/utils/cache/NftBySerialCache.ts";
import {NftCollectionCache} from "@/utils/cache/NftCollectionCache";
import {PendingAirdropCache} from "@/utils/cache/PendingAirdropCache.ts";
import {SelectedTokensCache} from "@/utils/cache/SelectedTokensCache.ts";
import {SourcifyCache} from "@/utils/cache/SourcifyCache";
import {StakeCache} from "@/utils/cache/StakeCache";
import {TokenAssociationCache} from "@/utils/cache/TokenAssociationCache";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import {TokenRelationshipCache} from "@/utils/cache/TokenRelationshipCache";
import {TopicByIdCache} from "@/utils/cache/TopicByIdCache";
import {TopicMessageByTimestampCache} from "@/utils/cache/TopicMessageByTimestampCache.ts";
import {TopicMessageCache} from "@/utils/cache/TopicMessageCache.ts";
import {TransactionByHashCache} from "@/utils/cache/TransactionByHashCache";
import {TransactionByIdCache} from "@/utils/cache/TransactionByIdCache";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache";
import {TransactionGroupByBlockCache} from "@/utils/cache/TransactionGroupByBlockCache";
import {TransactionGroupCache} from "@/utils/cache/TransactionGroupCache";
import {VerifiedContractsByAccountIdCache} from "@/utils/cache/VerifiedContractsByAccountIdCache";
import {VerifiedContractsCache} from "@/utils/cache/VerifiedContractsCache";
import {ScheduleByIdCache} from "@/utils/cache/ScheduleByIdCache.ts";

export class CacheUtils {

    public static clearAll(): void {
        AccountByAddressCache.instance.clear()
        AccountByAliasCache.instance.clear()
        AccountByIdCache.instance.clear()
        AdminContractCache.instance.clear()
        AssetCache.instance.clear()
        BalanceCache.instance.clear()
        BlockByHashCache.instance.clear()
        BlockByNbCache.instance.clear()
        BlockByTsCache.instance.clear()
        ContractByAddressCache.instance.clear()
        ContractByIdCache.instance.clear()
        ContractResultByHashCache.instance.clear()
        ContractResultByTransactionIdCache.instance.clear()
        ContractResultByTsCache.instance.clear()
        ContractResultsLogsByContractIdCache.instance.clear()
        ERC20Cache.instance.clear()
        ERC20InfoCache.instance.clear()
        ERC721Cache.instance.clear()
        ERC721InfoCache.instance.clear()
        HCSAssetCache.instance.clear()
        HbarPriceCache.instance.clear()
        LabelByIdCache.instance.clear()
        LastTopicMessageByIdCache.instance.clear()
        LogicContractCache.instance.clear()
        // IPFSCache.instance => no clear: we preserve it because IPFS content is valid for all networks
        NetworkCache.instance.clear()
        NetworkFeesCache.instance.clear()
        NftBySerialCache.instance.clear()
        NftCollectionCache.instance.clear()
        PendingAirdropCache.instance.clear()
        ScheduleByIdCache.instance.clear()
        SelectedTokensCache.instance.clear()
        // SignatureCache.instance => no clear: we preserve it because 4byte content is valid for all networks
        SourcifyCache.instance.clear()
        StakeCache.instance.clear()
        TokenAssociationCache.instance.clear()
        TokenInfoCache.instance.clear()
        TokenRelationshipCache.instance.clear()
        TopicByIdCache.instance.clear()
        TopicMessageByTimestampCache.instance.clear()
        TopicMessageCache.instance.clear()
        TransactionByHashCache.instance.clear()
        TransactionByIdCache.instance.clear()
        TransactionByTsCache.instance.clear()
        TransactionGroupByBlockCache.instance.clear()
        TransactionGroupCache.instance.clear()
        VerifiedContractsByAccountIdCache.instance.clear()
        VerifiedContractsCache.instance.clear()
    }
}
