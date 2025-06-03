// SPDX-License-Identifier: Apache-2.0

import {RouteRecordRaw} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";
import PageNotFound from "@/pages/PageNotFound.vue";
import MainDashboard from "@/pages/MainDashboard.vue";
import RoutingSpec from "@/pages/RoutingSpec.vue";
import Transactions from "@/pages/Transactions.vue";
import TransactionsById from "@/pages/TransactionsById.vue";
import TransactionDetails from "@/pages/TransactionDetails.vue";
import ScheduleDetails from "@/pages/ScheduleDetails.vue";
import Accounts from "@/pages/Accounts.vue";
import AccountsWithKey from "@/pages/AccountsWithKey.vue";
import AccountDetails from "@/pages/AccountDetails.vue";
import AdminKeyDetails from "@/pages/AdminKeyDetails.vue";
import NodeAdminKeyDetails from "@/pages/NodeAdminKeyDetails.vue";
import AddressDetails from "@/pages/AddressDetails.vue";
import Tokens from "@/pages/Tokens.vue";
import TokenDetails from "@/pages/TokenDetails.vue";
import NftDetails from "@/pages/NftDetails.vue";
import TokensByName from "@/pages/TokensByName.vue";
import TokensByPopularity from "@/pages/TokensByPopularity.vue";
import TokensByAccount from "@/pages/TokensByAccount.vue";
import Contracts from "@/pages/Contracts.vue";
import ERC20ByName from "@/pages/ERC20ByName.vue";
import ERC721ByName from "@/pages/ERC721ByName.vue";
import ContractDetails from "@/pages/ContractDetails.vue";
import Topics from "@/pages/Topics.vue";
import TopicDetails from "@/pages/TopicDetails.vue";
import Nodes from "@/pages/Nodes.vue";
import NodeDetails from "@/pages/NodeDetails.vue";
import Staking from "@/pages/Staking.vue";
import Blocks from "@/pages/Blocks.vue";
import BlockDetails from "@/pages/BlockDetails.vue";
import SearchHelp from "@/pages/SearchHelp.vue";

export enum TabId {
    Dashboard = "Dashboard",
    Transactions = "Transactions",
    Tokens = "Tokens",
    Topics = "Topics",
    Contracts = "Contracts",
    Accounts = "Accounts",
    Nodes = "Nodes",
    Staking = "Staking",
    Blocks = "Blocks",
}

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/' + AppStorage.getLastNetwork() + '/dashboard'
    },
    {
        path: '/page-not-found',
        redirect: '/' + AppStorage.getLastNetwork() + '/page-not-found'
    },
    {
        path: '/:network/page-not-found',
        name: 'PageNotFound',
        component: PageNotFound,
        meta: {
            tabId: null
        }
    },
    {
        path: '/:network',
        redirect: {name: 'MainDashboard'}
    },
    {
        path: '/:network/dashboard',
        name: 'MainDashboard',
        component: MainDashboard,
        props: true,
        meta: {
            tabId: TabId.Dashboard
        }
    },
    {
        path: '/:network/spec',
        name: 'RoutingSpec',
        component: RoutingSpec,
        meta: {
            tabId: null
        },
    },
    {
        path: '/:network/transactions',
        name: 'Transactions',
        component: Transactions,
        props: true,
        meta: {
            tabId: TabId.Transactions
        }
    },
    {
        path: '/:network/transactionsById/:transactionId',
        name: 'TransactionsById',
        component: TransactionsById,
        props: true,
        meta: {
            tabId: TabId.Transactions
        }
    },
    {
        path: '/:network/transaction/:transactionLoc',
        name: 'TransactionDetails',
        component: TransactionDetails,
        props: true,
        meta: {
            tabId: TabId.Transactions
        }
    },
    {
        path: '/:network/schedule/:scheduleId',
        name: 'ScheduleDetails',
        component: ScheduleDetails,
        props: true,
        meta: {
            tabId: TabId.Transactions
        }
    },
    {
        path: '/:network/accounts',
        name: 'Accounts',
        component: Accounts,
        props: true,
        meta: {
            tabId: TabId.Accounts
        }
    },
    {
        path: '/:network/accountsWithKey/:pubKey',
        name: 'AccountsWithKey',
        component: AccountsWithKey,
        props: true,
        meta: {
            tabId: TabId.Accounts
        }
    },
    {
        path: '/:network/account/:accountId',
        name: 'AccountDetails',
        component: AccountDetails,
        props: true,
        meta: {
            tabId: TabId.Accounts
        }
    },
    {
        path: '/:network/adminKey/:accountId',
        name: 'AdminKeyDetails',
        component: AdminKeyDetails,
        props: true,
        meta: {
            tabId: TabId.Accounts
        }
    },
    {
        path: '/:network/nodeAdminKey/:nodeId',
        name: 'NodeAdminKeyDetails',
        component: NodeAdminKeyDetails,
        props: true,
        meta: {
            tabId: TabId.Nodes
        }
    },
    {
        // EIP 3091 Support
        path: '/:network/address/:accountAddress',
        name: 'AddressDetails',
        component: AddressDetails,
        props: true,
        meta: {
            tabId: TabId.Accounts
        }
    },
    {
        path: '/:network/tokens',
        name: 'Tokens',
        component: Tokens,
        props: true,
        meta: {
            tabId: TabId.Tokens
        }
    },
    {
        path: '/:network/token/:tokenId',
        name: 'TokenDetails',
        component: TokenDetails,
        props: true,
        meta: {
            tabId: TabId.Tokens
        }
    },
    {
        path: '/:network/token/:tokenId/:serialNumber',
        name: 'NftDetails',
        component: NftDetails,
        props: true,
        meta: {
            tabId: TabId.Tokens
        }
    },
    {
        path: '/:network/tokensByName/:name',
        name: 'TokensByName',
        component: TokensByName,
        props: true,
        meta: {
            tabId: TabId.Tokens
        }
    },
    {
        path: '/:network/tokensByPopularity/:name',
        name: 'TokensByPopularity',
        component: TokensByPopularity,
        props: true,
        meta: {
            tabId: TabId.Tokens
        }
    },
    {
        path: '/:network/tokensByAccount/:accountId',
        name: 'TokensByAccount',
        component: TokensByAccount,
        props: true,
        meta: {
            tabId: TabId.Tokens
        }
    },
    {
        path: '/:network/contracts',
        name: 'Contracts',
        component: Contracts,
        props: true,
        meta: {
            tabId: TabId.Contracts
        }
    },
    {
        path: '/:network/erc20ByName/:name',
        name: 'ERC20ByName',
        component: ERC20ByName,
        props: true,
        meta: {
            tabId: TabId.Contracts
        }
    },
    {
        path: '/:network/erc721ByName/:name',
        name: 'ERC721ByName',
        component: ERC721ByName,
        props: true,
        meta: {
            tabId: TabId.Contracts
        }
    },
    {
        path: '/:network/contract/:contractId',
        name: 'ContractDetails',
        component: ContractDetails,
        props: true,
        meta: {
            tabId: TabId.Contracts
        }
    },
    {
        path: '/:network/topics',
        name: 'Topics',
        component: Topics,
        props: true,
        meta: {
            tabId: TabId.Topics
        }
    },
    {
        path: '/:network/topic/:topicId',
        name: 'TopicDetails',
        component: TopicDetails,
        props: true,
        meta: {
            tabId: TabId.Topics
        }
    },
    {
        path: '/:network/nodes',
        name: 'Nodes',
        component: Nodes,
        props: true,
        meta: {
            tabId: TabId.Nodes
        }
    },
    {
        path: '/:network/node/:nodeId',
        name: 'NodeDetails',
        component: NodeDetails,
        props: true,
        meta: {
            tabId: TabId.Nodes
        }
    },
    {
        path: '/:network/staking',
        name: 'Staking',
        component: Staking,
        props: true,
        meta: {
            tabId: TabId.Staking
        }
    },
    {
        path: '/:network/blocks',
        name: 'Blocks',
        component: Blocks,
        props: true,
        meta: {
            tabId: TabId.Blocks
        }
    },
    {
        path: '/:network/block/:blockHon',
        name: 'BlockDetails',
        component: BlockDetails,
        props: true,
        meta: {
            tabId: TabId.Blocks
        }
    },
    {
        // EIP 3091 Support
        path: '/:network/tx/:transactionLoc',
        name: 'TransactionDetails3091',
        component: TransactionDetails,
        props: true,
        meta: {
            tabId: TabId.Transactions
        }
    },
    {
        path: '/:network/search-help',
        name: 'SearchHelp',
        component: SearchHelp,
        props: true,
        meta: {
            tabId: null
        }
    },
    {
        path: "/:catchAll(.*)",
        redirect: '/page-not-found'
    },
]
