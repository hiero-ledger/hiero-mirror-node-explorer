// SPDX-License-Identifier: Apache-2.0

import AccountDetails from "@/pages/AccountDetails.vue";
import AccountDetails_Allowances from "@/pages/AccountDetails_Allowances.vue";
import AccountDetails_Assets from "@/pages/AccountDetails_Assets.vue";
import AccountDetails_Operations from "@/pages/AccountDetails_Operations.vue";
import AccountDetails_Summary from "@/pages/AccountDetails_Summary.vue";
import Accounts from "@/pages/Accounts.vue";
import AccountsWithKey from "@/pages/AccountsWithKey.vue";
import AddressDetails from "@/pages/AddressDetails.vue";
import AdminKeyDetails from "@/pages/AdminKeyDetails.vue";
import BlockDetails from "@/pages/BlockDetails.vue";
import BlockDetails_Summary from "@/pages/BlockDetails_Summary.vue";
import BlockDetails_Transactions from "@/pages/BlockDetails_Transactions.vue";
import Blocks from "@/pages/Blocks.vue";
import ContractDetails from "@/pages/ContractDetails.vue";
import ContractDetails_ABI from "@/pages/ContractDetails_ABI.vue";
import ContractDetails_ByteCode from "@/pages/ContractDetails_ByteCode.vue";
import ContractDetails_Events from "@/pages/ContractDetails_Events.vue";
import ContractDetails_Others from "@/pages/ContractDetails_Others.vue";
import ContractDetails_SourceCode from "@/pages/ContractDetails_SourceCode.vue";
import ContractDetails_Summary from "@/pages/ContractDetails_Summary.vue";
import Contracts from "@/pages/Contracts.vue";
import ERC20ByName from "@/pages/ERC20ByName.vue";
import ERC721ByName from "@/pages/ERC721ByName.vue";
import Home from "@/pages/Home.vue";
import Metrics from "@/pages/Metrics.vue";
import NftDetails from "@/pages/NftDetails.vue";
import NodeAdminKeyDetails from "@/pages/NodeAdminKeyDetails.vue";
import NodeDetails from "@/pages/NodeDetails.vue";
import Nodes from "@/pages/Nodes.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import RoutingSpec from "@/pages/RoutingSpec.vue";
import ScheduleDetails from "@/pages/ScheduleDetails.vue";
import SearchHelp from "@/pages/SearchHelp.vue";
import Staking from "@/pages/Staking.vue";
import TokenDetails from "@/pages/TokenDetails.vue";
import TokenDetails_Holders from "@/pages/TokenDetails_Holders.vue";
import TokenDetails_Metadata from "@/pages/TokenDetails_Metadata.vue";
import TokenDetails_Others from "@/pages/TokenDetails_Others.vue";
import TokenDetails_Summary from "@/pages/TokenDetails_Summary.vue";
import Tokens from "@/pages/Tokens.vue";
import TokensByAccount from "@/pages/TokensByAccount.vue";
import TokensByName from "@/pages/TokensByName.vue";
import TokensByPopularity from "@/pages/TokensByPopularity.vue";
import TopicDetails from "@/pages/TopicDetails.vue";
import TopicDetails_Messages from "@/pages/TopicDetails_Messages.vue";
import TopicDetails_Others from "@/pages/TopicDetails_Others.vue";
import TopicDetails_Summary from "@/pages/TopicDetails_Summary.vue";
import Topics from "@/pages/Topics.vue";
import TransactionDetails from "@/pages/TransactionDetails.vue";
import TransactionDetails_Events from "@/pages/TransactionDetails_Events.vue";
import TransactionDetails_Message from "@/pages/TransactionDetails_Message.vue";
import TransactionDetails_Result from "@/pages/TransactionDetails_Result.vue";
import TransactionDetails_States from "@/pages/TransactionDetails_States.vue";
import TransactionDetails_Summary from "@/pages/TransactionDetails_Summary.vue";
import TransactionDetails_Trace from "@/pages/TransactionDetails_Trace.vue";
import Transactions from "@/pages/Transactions.vue";
import TransactionsById from "@/pages/TransactionsById.vue";
import {AppStorage} from "@/AppStorage.ts";
import {RouteRecordRaw} from "vue-router";

export enum TabId {
    Home = "Home",
    Transactions = "Transactions",
    Tokens = "Tokens",
    Topics = "Topics",
    Contracts = "Contracts",
    Accounts = "Accounts",
    Nodes = "Nodes",
    Staking = "Staking",
    Blocks = "Blocks",
    Metrics = "Metrics",
}

export const TRANSACTION_DETAILS_ROUTE: RouteRecordRaw = {
    path: '/:network/transaction/:transactionLoc',
    name: 'TransactionDetails',
    component: TransactionDetails,
    props: true,
    meta: {
        tabId: TabId.Transactions
    },
    children: [
        {
            path: '',
            name: 'TransactionDetails_Summary',
            component: TransactionDetails_Summary,
            props: true,
            meta: {
                tabLabel: "Summary"
            }
        },
        {
            path: 'message',
            name: 'TransactionDetails_Message',
            component: TransactionDetails_Message,
            props: true,
            meta: {
                tabLabel: "Message"
            }
        },
        {
            path: 'result',
            name: 'TransactionDetails_Result',
            component: TransactionDetails_Result,
            props: true,
            meta: {
                tabLabel: "Result"
            }
        },
        {
            path: 'trace',
            name: 'TransactionDetails_Trace',
            component: TransactionDetails_Trace,
            props: true,
            meta: {
                tabLabel: "Trace"
            }
        },
        {
            path: 'states',
            name: 'TransactionDetails_States',
            component: TransactionDetails_States,
            props: true,
            meta: {
                tabLabel: "States"
            }
        },
        {
            path: 'events',
            name: 'TransactionDetails_Events',
            component: TransactionDetails_Events,
            props: true,
            meta: {
                tabLabel: "Events"
            }
        },
    ],
}

export const CONTRACT_DETAILS_ROUTE: RouteRecordRaw = {
    path: '/:network/contract/:contractId',
    name: 'ContractDetails',
    component: ContractDetails,
    props: true,
    meta: {
        tabId: TabId.Contracts
    },
    children: [
        {
            path:'',
            name: 'ContractDetails_Summary',
            component: ContractDetails_Summary,
            props: true,
            meta: {
                tabLabel: "Summary"
            }
        },
        // {
        //     path:'assets',
        //     name: 'ContractDetails_Assets',
        //     component: ContractDetails_Assets,
        //     props: true,
        //     meta: {
        //         tabLabel: "Assets"
        //     }
        // },
        {
            path:'abi',
            name: 'ContractDetails_ABI',
            component: ContractDetails_ABI,
            props: true,
            meta: {
                tabLabel: "ABI"
            }
        },
        {
            path:'sources',
            name: 'ContractDetails_Source',
            component: ContractDetails_SourceCode,
            props: true,
            meta: {
                tabLabel: "Sources"
            }
        },
        {
            path:'bytecode',
            name: 'ContractDetails_ByteCode',
            component: ContractDetails_ByteCode,
            props: true,
            meta: {
                tabLabel: "Bytecode"
            }
        },
        {
            path:'events',
            name: 'ContractDetails_Events',
            component: ContractDetails_Events,
            props: true,
            meta: {
                tabLabel: "Events"
            }
        },
        {
            path:'others',
            name: 'ContractDetails_Others',
            component: ContractDetails_Others,
            props: true,
            meta: {
                tabLabel: "Others"
            }
        },
    ],
}

export const TOKEN_DETAILS_ROUTE: RouteRecordRaw = {

    path: '/:network/token/:tokenId',
    name: 'TokenDetails',
    component: TokenDetails,
    children: [
        {
            path: '',
            name: 'TokenDetails_Summary',
            component: TokenDetails_Summary,
            props: true,
            meta: {
                tabLabel: "Summary"
            }
        },
        {
            path: 'holders',
            name: 'TokenDetails_Holders',
            component: TokenDetails_Holders,
            props: true,
            meta: {
                tabLabel: "Holders"
            }
        },
        {
            path: 'metadata',
            name: 'TokenDetails_Metadata',
            props: true,
            component: TokenDetails_Metadata,
            meta: {
                tabLabel: "Metadata"
            }
        },
        {
            path: 'others',
            name: 'TokenDetails_Others',
            props: true,
            component: TokenDetails_Others,
            meta: {
                tabLabel: "Others"
            }
        },
    ],
    props: true,
    meta: {
        tabId: TabId.Tokens
    }
}

export const TOPIC_DETAILS_ROUTE: RouteRecordRaw = {

    path: '/:network/topic/:topicId',
    name: 'TopicDetails',
    component: TopicDetails,
    children: [
        {
            path: '',
            name: 'TopicDetails_Summary',
            component: TopicDetails_Summary,
            props: true,
            meta: {
                tabLabel: "Summary"
            }
        },
        {
            path: 'messages',
            name: 'TopicDetails_Messages',
            component: TopicDetails_Messages,
            props: true,
            meta: {
                tabLabel: "Messages"
            }
        },
        {
            path: 'others',
            name: 'TopicDetails_Others',
            props: true,
            component: TopicDetails_Others,
            meta: {
                tabLabel: "Others"
            }
        },
    ],
    props: true,
    meta: {
        tabId: TabId.Topics
    }
}

export const ACCOUNT_DETAILS_ROUTE: RouteRecordRaw = {

    path: '/:network/account/:accountId',
    name: 'AccountDetails',
    component: AccountDetails,
    children: [
        {
            path: '',
            name: 'AccountDetails_Summary',
            component: AccountDetails_Summary,
            props: true,
            meta: {
                tabLabel: "Summary"
            }
        },
        {
            path: 'assets',
            name: 'AccountDetails_Assets',
            component: AccountDetails_Assets,
            props: true,
            meta: {
                tabLabel: "Assets"
            }
        },
        {
            path: 'operations',
            name: 'AccountDetails_Operations',
            component: AccountDetails_Operations,
            props: true,
            meta: {
                tabLabel: "Operations"
            }
        },
        {
            path: 'allowances',
            name: 'AccountDetails_Allowances',
            props: true,
            component: AccountDetails_Allowances,
            meta: {
                tabLabel: "Allowances"
            }
        },
    ],
    props: true,
    meta: {
        tabId: TabId.Accounts
    }
}

export const BLOCK_DETAILS_ROUTE: RouteRecordRaw =     {
    path: '/:network/block/:blockHon',
    name: 'BlockDetails',
    component: BlockDetails,
    props: true,
    meta: {
        tabId: TabId.Blocks
    },
    children: [
        {
            path: '',
            name: 'BlockDetails_Summary',
            component: BlockDetails_Summary,
            props: true,
            meta: {
                tabLabel: "Summary"
            }
        },
        {
            path: 'transactions',
            name: 'BlockDetails_Transactions',
            component: BlockDetails_Transactions,
            props: true,
            meta: {
                tabLabel: "Transactions"
            }
        },
    ]
}

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/' + AppStorage.getLastNetwork() + '/home'
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
        redirect: {name: 'Home'}
    },
    {
        path: '/:network/home',
        name: 'Home',
        component: Home,
        props: true,
        meta: {
            tabId: TabId.Home
        }
    },
    // {
    //     path: '/:network/dashboard',
    //     redirect: to => {
    //         // receives the target route as the argument
    //         return to.path.replace(/dashboard$/, 'home')
    //     },
    // },
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
    TRANSACTION_DETAILS_ROUTE,
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
    ACCOUNT_DETAILS_ROUTE,
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
    TOKEN_DETAILS_ROUTE,
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
    CONTRACT_DETAILS_ROUTE,
    {
        path: '/:network/topics',
        name: 'Topics',
        component: Topics,
        props: true,
        meta: {
            tabId: TabId.Topics
        }
    },
    TOPIC_DETAILS_ROUTE,
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
    BLOCK_DETAILS_ROUTE,
    {
        path: '/:network/metrics',
        name: 'Metrics',
        component: Metrics,
        props: true,
        meta: {
            tabId: TabId.Metrics
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
