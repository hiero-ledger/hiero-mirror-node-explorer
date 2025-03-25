// SPDX-License-Identifier: Apache-2.0


//
// Fungible token inspired from https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.29662956
//

import {
    ContractStateResponse,
    KeyType,
    Schedule,
    SignatureType,
    TransactionResponse,
    TransactionType
} from "@/schemas/MirrorNodeSchemas.ts";

export const SAMPLE_TOKEN = {
    "admin_key": null,
    "auto_renew_account": "0.0.29612329",
    "auto_renew_period": 7776000,
    "created_timestamp": "1644660150.233378000",
    "custom_fees": {
        "created_timestamp": "1644660150.233378000",
        "fixed_fees": [
            {
                "amount": 5,
                "collector_account_id": "0.0.617888",
                "denominating_token_id": "0.0.29662956"
            },
            {
                "amount": 1,
                "collector_account_id": "0.0.617889",
                "denominating_token_id": "0.0.29662956"
            },
            {
                "amount": 2,
                "collector_account_id": "0.0.617890",
                "denominating_token_id": "0.0.29662956"
            },
            {
                "amount": 100000000,
                "collector_account_id": "0.0.617888",
                "denominating_token_id": null
            },
        ],
        "fractional_fees": [
            {
                "amount":
                    {
                        "numerator": 50,
                        "denominator": 10000
                    },
                "collector_account_id": "0.0.617888",
                "denominating_token_id": "0.0.29662956",
                "minimum": 0.01,
                "maximum": 2,
                "net_of_transfers": true
            },
            {
                "amount":
                    {
                        "numerator": 1,
                        "denominator": 1000
                    },
                "collector_account_id": "0.0.617889",
                "denominating_token_id": "0.0.29662956",
                "minimum": 0.01,
                "maximum": 2,
                "net_of_transfers": false
            },
            {
                "amount":
                    {
                        "numerator": 1,
                        "denominator": 500
                    },
                "collector_account_id": "0.0.617890",
                "denominating_token_id": "0.0.29662956"
            }
        ]
    },
    "decimals": "0",
    "deleted": false,
    "expiry_timestamp": null,
    "fee_schedule_key": null,
    "freeze_default": false,
    "freeze_key": {
        "_type": "ED25519",
        "key": "09ca6ec0beaf66b2465ed17d3c9e3fc4072058640127320d6c5d30ca9b2ad8da"
    },
    "initial_supply": "1",
    "kyc_key": null,
    "max_supply": "0",
    "memo": "Predator",
    "metadata": "",
    "metadata_key": null,
    "modified_timestamp": "1644660150.233378000",
    "name": "QmVGABnvpbPwLcfG4iuW2JSzY8MLkALhd54bdPAbJxoEkB",
    "pause_key": null,
    "pause_status": "NOT_APPLICABLE",
    "supply_key": null,
    "supply_type": "INFINITE",
    "symbol": "23423",
    "token_id": "0.0.29662956",
    "total_supply": "1",
    "treasury_account_id": "0.0.29624024",
    "type": "FUNGIBLE_COMMON",
    "wipe_key": {
        "_type": "ED25519",
        "key": "09ca6ec0beaf66b2465ed17d3c9e3fc4072058640127320d6c5d30ca9b2ad8da"
    }
}

export const SAMPLE_TOKEN_DUDE = {
    "admin_key": null,
    "auto_renew_account": "0.0.29612329",
    "auto_renew_period": 7776000,
    "created_timestamp": "1644660150.233378000",
    "custom_fees": {
        "created_timestamp": "1644660150.233378000",
        "fixed_fees": [
            {
                "amount": 5,
                "collector_account_id": "0.0.61788",
                "denominating_token_id": "0.0.29662957"
            }
        ],
        "fractional_fees": []
    },
    "decimals": "2",
    "deleted": false,
    "expiry_timestamp": null,
    "fee_schedule_key": null,
    "freeze_default": false,
    "freeze_key": {
        "_type": "ED25519",
        "key": "09ca6ec0beaf66b2465ed17d3c9e3fc4072058640127320d6c5d30ca9b2ad8da"
    },
    "initial_supply": "1",
    "kyc_key": null,
    "max_supply": "0",
    "memo": "234234",
    "metadata": "",
    "metadata_key": null,
    "modified_timestamp": "1644660150.233378000",
    "name": "QmVGABnvpbPwLcfG4iuW2JSzY8MLkALhd54bdPAbJxoEkB DUDE",
    "pause_key": null,
    "pause_status": "NOT_APPLICABLE",
    "supply_key": null,
    "supply_type": "INFINITE",
    "symbol": "23423 DUDE",
    "token_id": "0.0.29662957",
    "total_supply": "1",
    "treasury_account_id": "0.0.29624024",
    "type": "FUNGIBLE_COMMON",
    "wipe_key": {
        "_type": "ED25519",
        "key": "09ca6ec0beaf66b2465ed17d3c9e3fc4072058640127320d6c5d30ca9b2ad8da"
    }
}

export const SAMPLE_TOKEN_WITH_KEYS = {
    "admin_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "auto_renew_account": "0.0.91918",
    "auto_renew_period": 6999999,
    "created_timestamp": "1663133692.386591752",
    "custom_fees": {"created_timestamp": "1663133692.386591752", "fixed_fees": [], "royalty_fees": []},
    "decimals": "0",
    "deleted": true,
    "expiry_timestamp": null,
    "fee_schedule_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "freeze_default": false,
    "freeze_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "initial_supply": "0",
    "kyc_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "max_supply": "0",
    "memo": "Mirror Node acceptance test: 2022-09-14T05:35:30.365404855Z Update token",
    "metadata": "Unusable metadata",
    "metadata_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "modified_timestamp": "1663133730.475752003",
    "name": "QEYB_name",
    "pause_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "pause_status": "UNPAUSED",
    "supply_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "supply_type": "INFINITE",
    "symbol": "QEYB",
    "token_id": "0.0.91961",
    "total_supply": "0",
    "treasury_account_id": "0.0.91962",
    "type": "NON_FUNGIBLE_UNIQUE",
    "wipe_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"}
}

export const SAMPLE_DUDE_WITH_KEYS = {
    "admin_key": {"_type": "ED25519", "key": "583dcbbb561b50d0a7c4434b9da398394a2f426584ced4d4c891715685bd5919"},
    "auto_renew_account": "0.0.48113503",
    "auto_renew_period": 7776000,
    "created_timestamp": "1662470903.466156472",
    "custom_fees": {"created_timestamp": "1662470903.466156472", "fixed_fees": [], "royalty_fees": []},
    "decimals": "0",
    "deleted": false,
    "expiry_timestamp": "1670246903.466156472",
    "fee_schedule_key": {"_type": "ED25519", "key": "583dcbbb561b50d0a7c4434b9da398394a2f426584ced4d4c891715685bd5919"},
    "freeze_default": false,
    "freeze_key": {"_type": "ED25519", "key": "583dcbbb561b50d0a7c4434b9da398394a2f426584ced4d4c891715685bd5919"},
    "initial_supply": "0",
    "kyc_key": null,
    "max_supply": "1033",
    "memo": "",
    "metadata": "YmFma3JlaWJ1MjVhamFhbmtiM2J4aWh1bG9iZDI3ZGEyaW5xeTZreW10bjVtemxjdDZyZTdkaG9oNG0=",
    "metadata_key": {"_type": "ED25519", "key": "c539536f9599daefeeb777677aa1aeea2242dfc7cca92348c228a5187a0faf2b"},
    "modified_timestamp": "1662470957.014478706",
    "name": "Reptilian Egg NFT",
    "pause_key": {"_type": "ED25519", "key": "583dcbbb561b50d0a7c4434b9da398394a2f426584ced4d4c891715685bd5919"},
    "pause_status": "UNPAUSED",
    "supply_key": {"_type": "ProtobufEncoded", "key": "0a0518d5c1fd16"},
    "supply_type": "FINITE",
    "symbol": "RSSE",
    "token_id": "0.0.48193741",
    "total_supply": "5",
    "treasury_account_id": "0.0.48113503",
    "type": "NON_FUNGIBLE_UNIQUE",
    "wipe_key": {"_type": "ED25519", "key": "583dcbbb561b50d0a7c4434b9da398394a2f426584ced4d4c891715685bd5919"}
}

export const SAMPLE_TOKEN_WITHOUT_KEYS = {
    "admin_key": null,
    "auto_renew_account": "0.0.91918",
    "auto_renew_period": 6999999,
    "created_timestamp": "1663133692.386591752",
    "custom_fees": {"created_timestamp": "1663133692.386591752", "fixed_fees": [], "royalty_fees": []},
    "decimals": "0",
    "deleted": true,
    "expiry_timestamp": null,
    "fee_schedule_key": null,
    "freeze_default": false,
    "freeze_key": null,
    "initial_supply": "0",
    "kyc_key": null,
    "max_supply": "0",
    "memo": "Mirror Node acceptance test: 2022-09-14T05:35:30.365404855Z Update token",
    "metadata": "",
    "metadata_key": null,
    "modified_timestamp": "1663133730.475752003",
    "name": "QEYB_name",
    "pause_key": null,
    "pause_status": "UNPAUSED",
    "supply_key": null,
    "supply_type": "INFINITE",
    "symbol": "QEYB",
    "token_id": "0.0.91961",
    "total_supply": "0",
    "treasury_account_id": "0.0.91962",
    "type": "NON_FUNGIBLE_UNIQUE",
    "wipe_key": null
}

//
// NFT inspired from https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.748383
//

export const SAMPLE_NONFUNGIBLE = {
    "admin_key": {
        "_type": "ED25519",
        "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
    },
    "auto_renew_account": "0.0.700000",
    "auto_renew_period": 7776000,
    "created_timestamp": "1646580567.712861636",
    "custom_fees": {
        "created_timestamp": "1646580567.712861636",
        "fixed_fees": [
            {
                "amount": 5,
                "collector_account_id": "0.0.617888",
                "denominating_token_id": "0.0.748383"
            },
            {
                "amount": 1,
                "collector_account_id": "0.0.617889",
                "denominating_token_id": "0.0.748383"
            },
            {
                "amount": 2,
                "collector_account_id": "0.0.617890",
                "denominating_token_id": "0.0.748383"
            },
            {
                "amount": 100000000,
                "collector_account_id": "0.0.617888",
                "denominating_token_id": null
            },
        ],
        "royalty_fees": [
            {
                "amount":
                    {
                        "numerator": 50,
                        "denominator": 10000
                    },
                "collector_account_id": "0.0.617888",
                "fallback_fee": {
                    "amount": 500,
                    "denominating_token_id": "0.0.748383"
                }
            },
            {
                "amount":
                    {
                        "numerator": 1,
                        "denominator": 1000
                    },
                "collector_account_id": "0.0.617889",
                "fallback_fee": {
                    "amount": 100,
                    "denominating_token_id": "0.0.748383"
                }
            },
            {
                "amount":
                    {
                        "numerator": 1,
                        "denominator": 500
                    },
                "collector_account_id": "0.0.617890",
                "fallback_fee": {
                    "amount": 200,
                    "denominating_token_id": "0.0.748383"
                }
            }
        ]
    },
    "decimals": "0",
    "deleted": false,
    "expiry_timestamp": null,
    "fee_schedule_key": null,
    "freeze_default": false,
    "freeze_key": {
        "_type": "ED25519",
        "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
    },
    "initial_supply": "0",
    "kyc_key": null,
    "max_supply": "150",
    "memo": "",
    "metadata": "",
    "metadata_key": null,
    "modified_timestamp": "1646600193.520332000",
    "name": "Ħ Frens Kingdom",
    "pause_key": {
        "_type": "ED25519",
        "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
    },
    "pause_status": "UNPAUSED",
    "supply_key": {
        "_type": "ED25519",
        "key": "42ad41de57a7c12a7abfa98cff4a62fb078158e08ec12da67e8547dd76fd588c"
    },
    "supply_type": "FINITE",
    "symbol": "ĦFRENSKINGDOM",
    "token_id": "0.0.748383",
    "total_supply": "2",
    "treasury_account_id": "0.0.700000",
    "type": "NON_FUNGIBLE_UNIQUE",
    "wipe_key": {
        "_type": "ED25519",
        "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
    }
}

export const SAMPLE_NONFUNGIBLE_DUDE =
    {
        "admin_key": {
            "_type": "ED25519",
            "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
        },
        "auto_renew_account": "0.0.700000",
        "auto_renew_period": 7776000,
        "created_timestamp": "1646580567.712861636",
        "custom_fees": {
            "created_timestamp": "1646580567.712861636",
            "fixed_fees": [],
            "royalty_fees": [
                {
                    "amount":
                        {
                            "numerator": 500,
                            "denominator": 10000
                        },
                    "collector_account_id": "0.0.617888"
                }
            ]
        },
        "decimals": "0",
        "deleted": false,
        "expiry_timestamp": null,
        "fee_schedule_key": null,
        "freeze_default": false,
        "freeze_key": {
            "_type": "ED25519",
            "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
        },
        "initial_supply": "0",
        "kyc_key": null,
        "max_supply": "150",
        "memo": "",
        "metadata": "",
        "metadata_key": null,
        "modified_timestamp": "1646600193.520332000",
        "name": "Ħ Frens Kingdom Dude",
        "pause_key": {
            "_type": "ED25519",
            "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
        },
        "pause_status": "UNPAUSED",
        "supply_key": {
            "_type": "ED25519",
            "key": "42ad41de57a7c12a7abfa98cff4a62fb078158e08ec12da67e8547dd76fd588c"
        },
        "supply_type": "FINITE",
        "symbol": "ĦFRENSKINGDOM",
        "token_id": "0.0.748384",
        "total_supply": "2",
        "treasury_account_id": "0.0.700000",
        "type": "NON_FUNGIBLE_UNIQUE",
        "wipe_key": {
            "_type": "ED25519",
            "key": "c1a8c8c5b446ce053b6eff4fe4f0192f76535ea9ed6b2b91981177ba237f4b5d"
        }
    }

export const SAMPLE_TOKENS = {
    tokens: [
        SAMPLE_TOKEN,
        SAMPLE_NONFUNGIBLE
    ]
}

export const SAMPLE_TOKEN_WITH_LARGE_DECIMAL_COUNT = {
    "admin_key": {"_type": "ED25519", "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"},
    "auto_renew_account": "0.0.13688300",
    "auto_renew_period": 7776000,
    "created_timestamp": "1685137814.521997638",
    "custom_fees": {"created_timestamp": "1685137814.521997638", "fixed_fees": [], "fractional_fees": []},
    "decimals": "75",
    "deleted": false,
    "expiry_timestamp": "1692913814521997638",
    "fee_schedule_key": null,
    "freeze_default": false,
    "freeze_key": null,
    "initial_supply": "100000000000000",
    "kyc_key": null,
    "max_supply": "10000000000000000",
    "memo": "",
    "metadata": "",
    "metadata_key": null,
    "modified_timestamp": "1685137814.521997638",
    "name": "TestToken0",
    "pause_key": null,
    "pause_status": "NOT_APPLICABLE",
    "supply_key": {"_type": "ED25519", "key": "d6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f"},
    "supply_type": "FINITE",
    "symbol": "TTOK0",
    "token_id": "0.0.13688500",
    "total_supply": "100000000000000",
    "treasury_account_id": "0.0.13688300",
    "type": "FUNGIBLE_COMMON",
    "wipe_key": null
}

export const SAMPLE_BALANCES = {
    "timestamp": "1646726400.100874000",
    "balances": [
        {
            "account": "0.0.29693911",
            "balance": 1
        },
        {
            "account": "0.0.29624024",
            "balance": 0
        }
    ],
}

export const SAMPLE_NFTS = {
    "nfts": [
        {
            "account_id": "0.0.4346448",
            "created_timestamp": "1715777298.140701005",
            "delegating_spender": null,
            "deleted": false,
            "metadata": "Unusable Metadata",
            "modified_timestamp": "1715777409.504562003",
            "serial_number": 2,
            "spender": null,
            "token_id": "0.0.748383"
        },
        {
            "account_id": "0.0.700000",
            "created_timestamp": "1646599959.709228732",
            "deleted": false,
            "metadata": "YmFma3JlaWJ1MjVhamFhbmtiM2J4aWh1bG9iZDI3ZGEyaW5xeTZreW10bjVtemxjdDZyZTdkaG9oNG0=",
            "modified_timestamp": "1646599959.709228732",
            "serial_number": 1,
            "token_id": "0.0.748383"
        },
        {
            "account_id": "0.0.2646875",
            "created_timestamp": "1715726157.487084003",
            "delegating_spender": null,
            "deleted": false,
            "metadata": "aXBmczovL1FtUEo4Z20xSDhWN2JvUkdSYld2clpaMUpDMnlxc2ozaGJCSnlCYUxQZ0huUTg=",
            "modified_timestamp": "1715726162.297036850",
            "serial_number": 342,
            "spender": null,
            "token_id": "0.0.748383"
        }
    ]
}

export const SAMPLE_PENDING_AIRDROPS = {
    "airdrops": [
        {
            "amount": 84,
            "receiver_id": "0.0.1306",
            "sender_id": "0.0.1437",
            "serial_number": null,
            "timestamp": {"from": "1728570093.555349851", "to": null},
            "token_id": "0.0.4943664"
        },
        {
            "amount": null,
            "receiver_id": "0.0.1306",
            "sender_id": "0.0.1437",
            "serial_number": 2,
            "timestamp": {"from": "1727947750.622560000", "to": null},
            "token_id": "0.0.4901646"
        },
        {
            "amount": null,
            "receiver_id": "0.0.1306",
            "sender_id": "0.0.1437",
            "serial_number": 1,
            "timestamp": {"from": "1727947737.781781000", "to": null},
            "token_id": "0.0.4901646"
        },
        {
            "amount": 4200,
            "receiver_id": "0.0.1306",
            "sender_id": "0.0.1437",
            "serial_number": null,
            "timestamp": {"from": "1728570446.211307000", "to": null},
            "token_id": "0.0.2255333"
        }
    ],
    "links": {"next": null}
}

export const IPFS_GATEWAY_PREFIX = 'https://gateway.pinata.cloud/ipfs/'
export const IPFS_CID_METADATA = "UW1QSjhnbTFIOFY3Ym9SR1JiV3ZyWloxSkMyeXFzajNoYkJKeUJhTFBnSG5ROA=="
export const IPFS_METADATA = "aXBmczovL1FtUEo4Z20xSDhWN2JvUkdSYld2clpaMUpDMnlxc2ozaGJCSnlCYUxQZ0huUTg="
export const IPFS_METADATA_CONTENT_URL = IPFS_GATEWAY_PREFIX + "QmPJ8gm1H8V7boRGRbWvrZZ1JC2yqsj3hbBJyBaLPgHnQ8"
export const IPFS_IMAGE_URL = IPFS_GATEWAY_PREFIX + "QmXhGcYgJPgVmdDzkUuiK1RVy6fW7NVaJLLxir2iKLKRZU/0292-Shrak.png"
export const IPFS_METADATA_CONTENT = {
    "name": "Shrak #293",
    "creator": "@Buckyoto + @JuicyUnlimited for @KarateCombat",
    "creatorDID": "did:hedera:mainnet:7Prd74ry1Uct87nZqL3ny7aR7Cg46JamVbJgk8azVgUm;hedera:mainnet:fid=0.0.123",
    "type": "image/png",
    "description": "This is a collection about $KARATE. $KARATE is not for the faint of heart. Happy Karate De Mayo to all one thousand and all. www.KARATE.com",
    "image": "ipfs://QmXhGcYgJPgVmdDzkUuiK1RVy6fW7NVaJLLxir2iKLKRZU/0292-Shrak.png",
    "format": "HIP412@2.0.0",
    "attributes": [
        {
            "trait_type": "SEASON",
            "display_type": "string",
            "value": "0"
        },
        {
            "trait_type": "RANK",
            "display_type": "string",
            "value": "293"
        },
        {
            "trait_type": "USERNAME",
            "value": "Shrak"
        },
        {
            "trait_type": "SCORE",
            "display_type": "string",
            "value": "350200"
        }
    ]
}

export const AR_SERVER_PREFIX = 'https://arweave.net/'
export const AR_CID_METADATA = "YWNjcXdsZFNPWkw4NElHY3JuUFRJdDZGZ05RVE9sc1N5RVhTNC11OGtrNA"
export const AR_METADATA = "YXI6Ly9hY2Nxd2xkU09aTDg0SUdjcm5QVEl0NkZnTlFUT2xzU3lFWFM0LXU4a2s0"
export const AR_METADATA_CONTENT_URL = AR_SERVER_PREFIX + "accqwldSOZL84IGcrnPTIt6FgNQTOlsSyEXS4-u8kk4"
export const AR_IMAGE_URL = AR_SERVER_PREFIX + "3g1__QpZyBOlMUNUEE6YiBcoh0kdoDpimPFzpS8w_O4"
export const AR_METADATA_CONTENT = {
    "name": "DaVinciGraph BRONZE #2",
    "description": "DaVinciGraph Utility BRONZE NFT",
    "creator": "DaVinciGraph",
    "CID": "3g1__QpZyBOlMUNUEE6YiBcoh0kdoDpimPFzpS8w_O4",
    "image": "ar://3g1__QpZyBOlMUNUEE6YiBcoh0kdoDpimPFzpS8w_O4",
    "type": "image/png",
    "format": "DaVinciGraph",
    "attributes": [
        {
            "trait_type": "Color",
            "value": "Bronze"
        },
        {
            "trait_type": "Number",
            "value": "2"
        }
    ]
}

export const NON_STD_METADATA_CONTENT = {
    "custom": "Non standard metadata",
    "picture": "ipfs://QmXhGcYgJPgVmdDzkUuiK1RVy6fW7NVaJLLxir2iKLKRZU/0292-Shrak.png"
}

export const HTTPS_METADATA = "aHR0cHM6Ly9jbG91ZGZsYXJlLWlwZnMuY29tL2lwZnMvUW1QSjhnbTFIOFY3Ym9SR1JiV3ZyWloxSkMyeXFzajNoYkJKeUJhTFBnSG5ROA=="
export const HTTPS_METADATA_CONTENT_URL = "https://cloudflare-ipfs.com/ipfs/QmPJ8gm1H8V7boRGRbWvrZZ1JC2yqsj3hbBJyBaLPgHnQ8"

export const HCS_METADATA = "aGNzOi8vMS8wLjAuNTAxNjgyNw=="
export const HCS_TOPIC = "0.0.5016827"
export const HCS_TOPIC_MESSAGES = {
    "messages": [{
        "chunk_info": {
            "initial_transaction_id": {
                "account_id": "0.0.4368166",
                "nonce": 0,
                "scheduled": false,
                "transaction_valid_start": "1710651204.524472492"
            }, "number": 1, "total": 1
        },
        "consensus_timestamp": "1710651215.535497003",
        "message": "eyJvIjowLCJjIjoiZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxLTFV2L1FCZ3hRVUFvc3NwTElDcDZUTXdBM01DaENJRFdVTS9hdktldHVaOXU1RlEyODJCVjlGcWhGZUdRTCtSdEgyL0E1MDZnM01CalMvS2dFQUNBeHgwOENYdmJZV283eEcrWDB6Wmw2UlE1ZWp0QUE5SDVqd2MyWVJFcHZpZXpvNU1vYmN2R0RBSDM3TVZGMjlOSmFXM3B2RVpJZGhzK0o2eEtqNjhuYUErTWtKNlRzaWtHSnlXa2ZZWkR2dktqVDJTZHNlM1F3ZWRVcUFraXdLVDhIMUhpMDdwN2RmREVJK25hTW52K1lyb013SUVBRE1USU1WZzBGM3ZEMFFXekE9PSJ9",
        "payer_account_id": "0.0.4368166",
        "running_hash": "Lidj0R4ZZkguqigovmKat9FTkKNQwcqeNUj0ZfvH6DaaHD/b+VoyL8hHhbB2tAwK",
        "running_hash_version": 3,
        "sequence_number": 1,
        "topic_id": "0.0.5016827"
    }], "links": {"next": null}
}
export const HCS_METADATA_CONTENT = {
    "o": 0,
    "c": "data:application/json;base64,KLUv/QBgxQUAosspLICp6TMwA3MChCIDWUM/avKetuZ9u5FQ282BV9FqhFeGQL+RtH2/A506g3MBjS/KgEACAxx08CXvbYWo7xG+X0zZl6RQ5ejtAA9H5jwc2YREpviezo5MobcvGDAH37MVF29NJaW3pvEZIdhs+J6xKj68naA+MkJ6TsikGJyWkfYZDvvKjT2Sdse3QwedUqAkiwKT8H1Hi07p7dfDEI+naMnv+YroMwIEADMTIMVg0F3vD0QWzA=="
}

export const TOPIC_METADATA = "MC4wLjUwMTY4Mjc="

export const TIMESTAMP_METADATA = "MTcxMzUwOTQzNS44Nzg3NjIwMDM="
export const TIMESTAMP = "1713509435.878762003"
export const TIMESTAMP_SUBMIT_MESSAGE = {
    "chunk_info": {
        "initial_transaction_id": {
            "account_id": "0.0.5679025",
            "nonce": 0,
            "scheduled": false,
            "transaction_valid_start": "1713918758.268758530"
        }, "number": 1, "total": 1
    },
    "consensus_timestamp": "1713918763.034719003",
    "message": "eyJJZGVudGlmaWVyIjoiaUFzc2V0cyIsIlR5cGUiOiJQcm9maWxlIiwiQXV0aG9yIjoiMC4wLjU2NzkwMjUiLCJOYW1lIjoiaWJpcmQgIiwiQmlvIjoiIiwiV2Vic2l0ZSI6ImliaXJkLmNvbW11bml0eSIsIkxvY2F0aW9uIjoiIiwiVXNlck1lc3NhZ2VzIjoiMC4wLjU2NzkwNDUiLCJQaWN0dXJlIjoiaXBmczovL2JhZmtyZWlhYnFkbnp0M2l5NWtpbGZxbGt0dnptYndqbW9ra3h1NzM2NjJ5dnNpdnZteXhnb2huYnptIiwiQmFubmVyIjpudWxsfQ==",
    "payer_account_id": "0.0.5679025",
    "running_hash": "VBHsKHXb5RMi8b9wxk+e+uJ75HXymA5rZSXpSWum3o/Z4VgJCN8C3tEH3T4Fd84w",
    "running_hash_version": 3,
    "sequence_number": 1,
    "topic_id": "0.0.5679050"
}
export const TIMESTAMP_METADATA_CONTENT = {
    "Identifier": "iAssets",
    "Type": "Profile",
    "Author": "0.0.5679025",
    "Name": "ibird ",
    "Bio": "",
    "Website": "ibird.community",
    "Location": "",
    "UserMessages": "0.0.5679045",
    "Picture": "ipfs://bafkreiabqdnzt3iy5kilfqlktvzmbwjmokkxu73662yvsivvmyxgohnbzm",
    "Banner": null
}

//
// https://testnet.mirrornode.hedera.com/api/v1/transactions/0.0.29624024-1646025139-152901498
//

export const SAMPLE_TRANSACTION = {
    "bytes": null,
    "charged_tx_fee": 470065,
    "consensus_timestamp": "1646025151.667604000",
    "entity_id": null,
    "max_fee": "100000000",
    "memo_base64": "",
    "name": "CRYPTOTRANSFER",
    "nft_transfers": [],
    "node": "0.0.5",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "SUCCESS",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [
        {
            "token_id": "0.0.29662956",
            "account": "0.0.29624024",
            "amount": -1
        },
        {
            "token_id": "0.0.29662956",
            "account": "0.0.29693911",
            "amount": 1
        }
    ],
    "transaction_hash": "oBKWEjLtfShCg26V9+nENW/f4t4IGZCRcBqWnB0f2TZx0weO6Dso+0YKiLTL2OzS",
    "transaction_id": "0.0.29624024-1646025139-152901498",
    "transfers": [
        {
            "account": "0.0.4",
            "amount": 22028
        },
        {
            "account": "0.0.98",
            "amount": 448037
        },
        {
            "account": "0.0.29624024",
            "amount": -470065
        }
    ],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1646025139.152901498",
}

export const SAMPLE_FAILED_TRANSACTION = {
    "bytes": null,
    "charged_tx_fee": 120694790,
    "consensus_timestamp": "1652256326.071602560",
    "entity_id": "0.0.34739492",
    "max_fee": "1000000000",
    "memo_base64": "",
    "name": "CONTRACTCALL",
    "nft_transfers": [],
    "node": "0.0.3",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "CONTRACT_REVERT_EXECUTED",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [],
    "transaction_hash": "kLnhFcr1zLlhcuH4Doz6VF20IB4dEaxomChYqSie0+xkDNwaWrd2UFWl0ZxWYStj",
    "transaction_id": "0.0.34376678-1652256313-310050890",
    "transfers": [
        {
            "account": "0.0.3",
            "amount": 1719386,
            "is_approval": false
        },
        {
            "account": "0.0.98",
            "amount": 118975404,
            "is_approval": false
        },
        {
            "account": "0.0.34376678",
            "amount": -120694790,
            "is_approval": false
        }
    ],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1652256313.310050890"
}

export const SAMPLE_TRANSACTIONS = {
    "transactions": [
        SAMPLE_TRANSACTION
    ]
}

export const SAMPLE_FAILED_TRANSACTIONS = {
    "transactions": [
        SAMPLE_FAILED_TRANSACTION
    ]
}

// https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=2&transactiontype=CONTRACTCALL

export const SAMPLE_CONTRACTCALL_TRANSACTIONS = {
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 95515604,
            "consensus_timestamp": "1646665766.574738471",
            "entity_id": "0.0.749774",
            "max_fee": "20000000",
            "memo_base64": "TWlycm9yIE5vZGUgYWNjZXB0YW5jZSB0ZXN0OiAyMDIyLTAzLTA3VDE1OjA5OjI2LjA2NjY4MDk3N1ogRXhlY3V0ZSBjb250cmFjdA==",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.3",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "INSUFFICIENT_GAS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "rW+y3bjDPq1I3d7WeeyNbROuerh9oG8xcthiCodI5Q1xMHXInn3qOUR7TLj6LNQo",
            "transaction_id": "0.0.950-1646665756-235554077",
            "transfers": [
                {
                    "account": "0.0.3",
                    "amount": 881921
                },
                {
                    "account": "0.0.98",
                    "amount": 94633683
                },
                {
                    "account": "0.0.950",
                    "amount": -95515604
                }
            ],
            "valid_duration_seconds": null,
            "valid_start_timestamp": "1646665756.235554077"
        },
        {
            "bytes": null,
            "charged_tx_fee": 98634856,
            "consensus_timestamp": "1646664154.866913000",
            "entity_id": "0.0.749723",
            "max_fee": "10000000000",
            "memo_base64": "TWlycm9yIE5vZGUgYWNjZXB0YW5jZSB0ZXN0OiAyMDIyLTAzLTA3VDE0OjQyOjMzLjk4NzcxMTIwMlogRXhlY3V0ZSBjb250cmFjdA==",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.3",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "INSUFFICIENT_GAS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "Vz4cLGBUmxgYSaHJu1bcxi2/1Heildtgg3zSbpp2xX3jqG0PsQJJYdp0rg+9nV7h",
            "transaction_id": "0.0.950-1646664143-028737238",
            "transfers": [
                {
                    "account": "0.0.3",
                    "amount": 887925
                },
                {
                    "account": "0.0.98",
                    "amount": 97746931
                },
                {
                    "account": "0.0.950",
                    "amount": -98634856
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646664143.028737238"
        }
    ]
}

export const SAMPLE_SYSTEM_CONTRACT_CALL_TRANSACTIONS = {
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 0,
            "consensus_timestamp": "1662623752.949648610",
            "entity_id": "0.0.359",
            "max_fee": "0",
            "memo_base64": "",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": null,
            "nonce": 2,
            "parent_consensus_timestamp": "1662623752.949648608",
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "LC8tH/tqkOEndC3ERShZO7n6NSxhdhbkSZJX3hnbwKAWaQ2KLMsg1DgaXByxrUEY",
            "transaction_id": "0.0.29511696-1662623740-379586211",
            "transfers": [],
            "valid_duration_seconds": null,
            "valid_start_timestamp": "1662623740.379586211"
        }
    ]
}

export const SAMPLE_CRYPTO_TRANSFER_WITH_ONLY_FEE = {
    "bytes": null,
    "charged_tx_fee": 26494683,
    "consensus_timestamp": "1687197609.495612761",
    "entity_id": "0.0.3005010",
    "max_fee": "200000000",
    "memo_base64": "",
    "name": "CONSENSUSCREATETOPIC",
    "nft_transfers": [],
    "node": "0.0.25",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "SUCCESS",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [],
    "transaction_hash": "c2sSCuCRNOI6gvCYs5KFxe7Z60TV8vJXxuOWNEtH4doYj0MnruIi3NLFXIX6e8s1",
    "transaction_id": "0.0.1786365-1687197599-390469131",
    "transfers": [{"account": "0.0.25", "amount": 1190235, "is_approval": false}, {
        "account": "0.0.98",
        "amount": 22774004,
        "is_approval": false
    }, {"account": "0.0.800", "amount": 2530444, "is_approval": false}, {
        "account": "0.0.1786365",
        "amount": -26494683,
        "is_approval": false
    }],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1687197599.390469131"
}

export const SAMPLE_CRYPTO_TRANSFER_WITH_REWARDS = {
    "bytes": null,
    "charged_tx_fee": 5351935,
    "consensus_timestamp": "1687133236.139653690",
    "entity_id": null,
    "max_fee": "100000000",
    "memo_base64": "KDAuMC4yOTk4NTU1KUNvbmZpcm0gcHVyY2hhc2Ugb2YgTkZUOiAwLjAuMjE3Mzg5OSB3aXRoIHNlcmlhbCBudW1iZXIgMTYxMiBmb3IgMjUgSEJBUg==",
    "name": "CRYPTOTRANSFER",
    "nft_transfers": [],
    "node": "0.0.4",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "SUCCESS",
    "scheduled": false,
    "token_transfers": [],
    "staking_reward_transfers": [{"account": "0.0.788887", "amount": 210704256}, {
        "account": "0.0.2254995",
        "amount": 2289378672
    }],
    "transaction_hash": "9s/JADOEqzUy4yzZA0StoTfumGL0bAALPs9tKbE/ELX0AY6gkbTl4potlyd3XHeU",
    "transaction_id": "0.0.690356-1687133220-052118241",
    "transfers": [{"account": "0.0.4", "amount": 206713, "is_approval": false}, {
        "account": "0.0.98",
        "amount": 4630700,
        "is_approval": false
    }, {"account": "0.0.800", "amount": -2499568406, "is_approval": false}, {
        "account": "0.0.690356",
        "amount": -5351935,
        "is_approval": false
    }, {"account": "0.0.755188", "amount": 2280000000, "is_approval": false}, {
        "account": "0.0.788887",
        "amount": 330704256,
        "is_approval": false
    }, {"account": "0.0.2254995", "amount": 2389378672, "is_approval": false}, {
        "account": "0.0.2998555",
        "amount": -2500000000,
        "is_approval": false
    }],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1687133220.052118241"
}

export const SAMPLE_TOKEN_CALL_TRANSACTIONS = {
    "transactions": [{
        "bytes": null,
        "charged_tx_fee": 93600000,
        "consensus_timestamp": "1677545104.611658003",
        "entity_id": "0.0.781589",
        "max_fee": "200000000",
        "memo_base64": "",
        "name": "CONTRACTCALL",
        "nft_transfers": [],
        "node": "0.0.14",
        "nonce": 0,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [{"account": "0.0.939841", "amount": 6816724320}],
        "token_transfers": [],
        "transaction_hash": "v0daADT5AeJQdNGIpDZww+amcD9C1ngBhzQwPhm7g8BRtvN1p2TaOLHIMtD0C0MS",
        "transaction_id": "0.0.939841-1677545092-878406670",
        "transfers": [{"account": "0.0.98", "amount": 93600000, "is_approval": false}, {
            "account": "0.0.800",
            "amount": -6816724320,
            "is_approval": false
        }, {"account": "0.0.939841", "amount": 6723124320, "is_approval": false}],
        "valid_duration_seconds": "120",
        "valid_start_timestamp": "1677545092.878406670"
    }], "links": {"next": null}
}

export const SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN = {
    "transactions": [{
        "bytes": null,
        "charged_tx_fee": 227282050,
        "consensus_timestamp": "1687555828.300024003",
        "entity_id": "0.0.230049",
        "max_fee": "1080000000",
        "memo_base64": "",
        "name": "ETHEREUMTRANSACTION",
        "nft_transfers": [],
        "node": "0.0.6",
        "nonce": 0,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "Ws8zcqKAVEGr2R9MP3uidkx8Uh66/6g9VfhmGTOr6DNFRSj5MbalwBkNX8WaWoe5",
        "transaction_id": "0.0.902-1687555818-297907508",
        "transfers": [{"account": "0.0.6", "amount": 2910, "is_approval": false}, {
            "account": "0.0.98",
            "amount": 227279140,
            "is_approval": false
        }, {"account": "0.0.902", "amount": -82050, "is_approval": false}, {
            "account": "0.0.42224",
            "amount": -227200000,
            "is_approval": false
        }],
        "valid_duration_seconds": "120",
        "valid_start_timestamp": "1687555818.297907508"
    }, {
        "bytes": null,
        "charged_tx_fee": 0,
        "consensus_timestamp": "1687555828.300024004",
        "entity_id": "0.0.42224",
        "max_fee": "0",
        "memo_base64": "",
        "name": "TOKENASSOCIATE",
        "nft_transfers": [],
        "node": null,
        "nonce": 1,
        "parent_consensus_timestamp": "1687555828.300024003",
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "uWkCIG7doSPwu0YiF1sOxiUmh5qfuVW1zsnsvmtn59Dwpu8bUDUJVsg6LMvms/ak",
        "transaction_id": "0.0.902-1687555818-297907508",
        "transfers": [],
        "valid_duration_seconds": null,
        "valid_start_timestamp": "1687555818.297907508"
    }]
}

export const SAMPLE_CONTRACT_RESULTS = {
    "results": [
        {
            "address": "0x0000000000000000000000000000000000336f6f",
            "amount": 0,
            "bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "call_result": "0x",
            "contract_id": "0.0.3370863",
            "created_contract_ids": [],
            "error_message": null,
            "from": "0x00000000000000000000000000000000000004ec",
            "function_parameters": "0x9f1159210000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000005161500000000000000000000000000000000000000000000000000000000000000044d69636b00000000000000000000000000000000000000000000000000000000",
            "gas_limit": 100000,
            "gas_used": 80000,
            "timestamp": "1675415497.973978003",
            "to": "0x0000000000000000000000000000000000336f6f",
            "hash": "0x23a6480c03bd8f1a07fbb5aee5eb4ada0671f0f1d93b51fdf45b51eb14eee4b1"
        },
        {
            "address": "0x0000000000000000000000000000000000336f6f",
            "amount": 0,
            "bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "call_result": "0x608060405234801561001057600080fd5b50600436106100415760003560e01c806314b3ee68146100465780639f11592114610076578063fd8111e914610092575b600080fd5b610060600480360381019061005b9190610298565b6100c2565b60405161006d91906102fa565b60405180910390f35b610090600480360381019061008b9190610341565b6100e9565b005b6100ac60048036038101906100a79190610298565b610110565b6040516100b991906102fa565b60405180910390f35b600080826040516100d3919061040e565b9081526020016040518091039020549050919050565b806000836040516100fa919061040e565b9081526020016040518091039020819055505050565b6000818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6101a58261015c565b810181811067ffffffffffffffff821117156101c4576101c361016d565b5b80604052505050565b60006101d761013e565b90506101e3828261019c565b919050565b600067ffffffffffffffff8211156102035761020261016d565b5b61020c8261015c565b9050602081019050919050565b82818337600083830152505050565b600061023b610236846101e8565b6101cd565b90508281526020810184848401111561025757610256610157565b5b610262848285610219565b509392505050565b600082601f83011261027f5761027e610152565b5b813561028f848260208601610228565b91505092915050565b6000602082840312156102ae576102ad610148565b5b600082013567ffffffffffffffff8111156102cc576102cb61014d565b5b6102d88482850161026a565b91505092915050565b6000819050919050565b6102f4816102e1565b82525050565b600060208201905061030f60008301846102eb565b92915050565b61031e816102e1565b811461032957600080fd5b50565b60008135905061033b81610315565b92915050565b6000806040838503121561035857610357610148565b5b600083013567ffffffffffffffff8111156103765761037561014d565b5b6103828582860161026a565b92505060206103938582860161032c565b9150509250929050565b600081519050919050565b600081905092915050565b60005b838110156103d15780820151818401526020810190506103b6565b60008484015250505050565b60006103e88261039d565b6103f281856103a8565b93506104028185602086016103b3565b80840191505092915050565b600061041a82846103dd565b91508190509291505056fea2646970667358221220a31fabb88354c9f0b715761adf83bb5c7fe132d0d3f3106a874d17a0e03e228d64736f6c63430008110033",
            "contract_id": "0.0.3370863",
            "created_contract_ids": ["0.0.3370863"],
            "error_message": null,
            "from": "0x00000000000000000000000000000000000004ec",
            "function_parameters": "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000001b2070000000000000000000000000000000000000000000000000000000000000005416c696365000000000000000000000000000000000000000000000000000000",
            "gas_limit": 100000,
            "gas_used": 80000,
            "timestamp": "1675415364.585203549",
            "to": "0x0000000000000000000000000000000000336f6f",
            "hash": "0xd5907850f485803a3fa858ab8bbe951b991c36b04e86e8d203162b1175535bcc"
        }
    ], "links": {"next": null}
}

export const SAMPLE_CONTRACT_RESULT_DETAILS = {
    "amount": 0,
    "bloom": "0x00200001002000000001000090000000000000000000010000040000000000000000000040000000000000000001000000000000000000000000180000000000800000000000040000000000000000200000000000000000000208000000000000000000020800000000000000000800000800000000000000000040000000000000000000000000000002000000100100000000000000080000004000000000000080000000000020000000000000000040000000010000000000000000000000002100000000000000000000000080200000002000001000000000002020000000000000000000000000000000000040000000000000100000000000000020",
    "call_result": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000174876e800000000000000000000000000000000000000000000000000000000000a4bd29a0000000000000000000000000000000000000000000000000000001b34393b8a",
    "contract_id": "0.0.1062787",
    "created_contract_ids": [],
    "error_message": null,
    "from": "0x00000000000000000000000000000000000ce9b4",
    "function_parameters": "0x18cbafe5000000000000000000000000000000000000000000000000000000174876e8000000000000000000000000000000000000000000000000000000001b2702b2a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000ce9b4000000000000000000000000000000000000000000000000000001831e10602d000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000cba4400000000000000000000000000000000000000000000000000000000000d1ea60000000000000000000000000000000000000000000000000000000000103708",
    "gas_limit": 480000,
    "gas_used": 384000,
    "timestamp": SAMPLE_TRANSACTION.consensus_timestamp,
    "to": "0x0000000000000000000000000000000000103783",
    "hash": "0xc43db9eacf72c91629ac03088535dd9ae41059a2c1eefce3a528e04e7e908d2d",
    "block_hash": "0x9128e0c85440fb647c642d9b9982d339320105cc2b0287ea8cdb0d29e4a3dd2eaa2ecfbcd4ed69ca83200905b2991702",
    "block_number": 37392133,
    "logs": [
        {
            "address": "0x0000000000000000000000000000000000103783",
            "bloom": "0x00000001000000000001000010000000000000000000000000000000000000000000000040000000000000000001000000000000000000000000100000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000040000000000000100000000000000000",
            "contract_id": "0.0.1062787",
            "data": "0x000000000000000000000000000000000000000000000000000000174876e800",
            "index": 0,
            "topics": ["0x831ac82b07fb396dafef0077cea6e002235d88e63f35cbd5df2c065107f1e74a", "0x00000000000000000000000000000000000000000000000000000000000ce9b4", "0x000000000000000000000000aa52d22bf3c60319edde45553aef6483c463cca8"]
        },
        {
            "address": "0x0000000000000000000000000000000000108a83",
            "bloom": "0x00000000002000000001000010000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000040000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000100000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000100000000000000020",
            "contract_id": "0.0.1084035",
            "data": "0x000000000000000000000000000000000000000000000000000000000a4bd29a",
            "index": 1,
            "topics": ["0x831ac82b07fb396dafef0077cea6e002235d88e63f35cbd5df2c065107f1e74a", "0x000000000000000000000000aa52d22bf3c60319edde45553aef6483c463cca8", "0x000000000000000000000000c9d6c8fe1a7bdbb273559aaf0c5fc8ae75bc6a6f"]
        },
        {
            "address": "0x0000000000000000000000000000000000108a83",
            "bloom": "0x00000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000001000000000000000000000000000000000000000000000000000000000000000000000000000000020",
            "contract_id": "0.0.1084035",
            "data": "0x000000000000000000000000000000000000000000000000000068553a24f73e0000000000000000000000000000000000000000000000000000002e3c815cae",
            "index": 2,
            "topics": ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"]
        },
        {
            "address": "0x0000000000000000000000000000000000108a83",
            "bloom": "0x00200000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000200000000000000000000000000000000000000000000800000000000000000000000800000000000000000000000000000000000000000000000002000000000000000000000000000000004000000000000000000000000020000000000000000000000000000000000000000000000000000100000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000020",
            "contract_id": "0.0.1084035",
            "data": "0x000000000000000000000000000000000000000000000000000000174876e80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4bd29a",
            "index": 3,
            "topics": ["0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822", "0x0000000000000000000000000000000000000000000000000000000000103783", "0x000000000000000000000000c9d6c8fe1a7bdbb273559aaf0c5fc8ae75bc6a6f"]
        },
        {
            "address": "0x0000000000000000000000000000000000108a35",
            "bloom": "0x00000000002000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000040000000000000000000000000000000000000100000000000000000000000000000000000000080000000000000000000000000000040000000000000000000000000000000000100000000000000000000000000000000000000000000000000002000000000000000000000000000000000000040000000000000100000000000000000",
            "contract_id": "0.0.1083957",
            "data": "0x0000000000000000000000000000000000000000000000000000001b34393b8a",
            "index": 4,
            "topics": ["0x831ac82b07fb396dafef0077cea6e002235d88e63f35cbd5df2c065107f1e74a", "0x000000000000000000000000c9d6c8fe1a7bdbb273559aaf0c5fc8ae75bc6a6f", "0x00000000000000000000000000000000000000000000000000000000000ce9b4"]
        },
        {
            "address": "0x0000000000000000000000000000000000108a35",
            "bloom": "0x00000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000080000000000000000000080000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "contract_id": "0.0.1083957",
            "data": "0x0000000000000000000000000000000000000000000000000000003bc25f68f100000000000000000000000000000000000000000000000000009e42d8e5fa71",
            "index": 5,
            "topics": ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"]
        },
        {
            "address": "0x0000000000000000000000000000000000108a35",
            "bloom": "0x00200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000800000000000000000000000000000200000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000004000000000000080000000000020000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000040000000000000000000000000000000",
            "contract_id": "0.0.1083957",
            "data": "0x000000000000000000000000000000000000000000000000000000000a4bd29a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b34393b8a",
            "index": 6,
            "topics": ["0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822", "0x0000000000000000000000000000000000000000000000000000000000103783", "0x00000000000000000000000000000000000000000000000000000000000ce9b4"]
        },
        {
            "address": "0x0000000000000000000000000000000000103707",
            "bloom": "0x00000000000000000001000000000000000000000000010000040000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080200000000000000000000000002000000000000000000000000000000000000040000000000000100000000000000000",
            "contract_id": "0.0.1062663",
            "data": "0x0000000000000000000000000000000000000000000000000000001b34393b8a",
            "index": 7,
            "topics": ["0x831ac82b07fb396dafef0077cea6e002235d88e63f35cbd5df2c065107f1e74a", "0x00000000000000000000000000000000000000000000000000000000000ce9b4", "0x0000000000000000000000000000000000000000000000000000000000103707"]
        },
        {
            "address": "0x0000000000000000000000000000000000103707",
            "bloom": "0x00000000000000000001000000000000000000000000010000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000800000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000002020000000000000000000000000000000000040000000000000100000000000000000",
            "contract_id": "0.0.1062663",
            "data": "0x0000000000000000000000000000000000000000000000000000001b34393b8a",
            "index": 8,
            "topics": ["0x831ac82b07fb396dafef0077cea6e002235d88e63f35cbd5df2c065107f1e74a", "0x00000000000000000000000000000000000000000000000000000000000ce9b4", "0x0000000000000000000000000000000000000000000000000000000000000000"]
        },
        {
            "address": "0x0000000000000000000000000000000000103707",
            "bloom": "0x00000000000000000000000000000000000000000000010000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000208000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000080000000000000000000000000002000000000000000000000000000000000000040000000000000000000000000000000",
            "contract_id": "0.0.1062663",
            "data": "0x0000000000000000000000000000000000000000000000000000001b34393b8a",
            "index": 9,
            "topics": ["0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398", "0x00000000000000000000000000000000000000000000000000000000000ce9b4", "0x00000000000000000000000000000000000000000000000000000000000ce9b4"]
        }
    ],
    "result": "SUCCESS",
    "transaction_index": 37,
    "state_changes": [],
    "status": "0x1",
    "failed_initcode": null,
    "access_list": null,
    "block_gas_used": 384000,
    "chain_id": null,
    "gas_price": null,
    "max_fee_per_gas": null,
    "max_priority_fee_per_gas": null,
    "r": null,
    "s": null,
    "type": null,
    "v": null,
    "nonce": 104
}

export const SAMPLE_FILE_UPDATE_TRANSACTION = {
    "bytes": null,
    "charged_tx_fee": 0,
    "consensus_timestamp": "1654796534.535093000",
    "entity_id": "0.0.111",
    "max_fee": "10000000000",
    "memo_base64": "w4PCrsOCwrfDg8K5dEY4w4LCrkrDg8KLw4PCkMODwo4=",
    "name": "FILEUPDATE",
    "nft_transfers": [],
    "node": "0.0.3",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "FEE_SCHEDULE_FILE_PART_UPLOADED",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [],
    "transaction_hash": "QIzB4Hk94f7FXwktUCVTbgpmsbMExd8MRBZ1n8nYbuwVKx9I2dSF6rYAYtCgtcGc",
    "transaction_id": "0.0.56-1654796473-000000434",
    "transfers": [],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1654796473.000000434"
}

export const SAMPLE_CONTRACT_CALL_TRANSACTION = {
    "bytes": null,
    "charged_tx_fee": 0,
    "consensus_timestamp": SAMPLE_CONTRACT_RESULT_DETAILS.timestamp,
    "entity_id": "0.0.359",
    "max_fee": "0",
    "memo_base64": "",
    "name": "CONTRACTCALL",
    "node": null,
    "nonce": 2,
    "parent_consensus_timestamp": "1662623752.949648608",
    "result": "SUCCESS",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [],
    "transaction_hash": "LC8tH/tqkOEndC3ERShZO7n6NSxhdhbkSZJX3hnbwKAWaQ2KLMsg1DgaXByxrUEY",
    "transaction_id": "0.0.29511696-1662623740-379586211",
    "transfers": [],
    "valid_duration_seconds": null,
    "valid_start_timestamp": "1662623740.379586211"
}

export const SAMPLE_REVERT_CONTRACT_RESULT_DETAILS = {
    "address": "0x0000000000000000000000000000000000362667",
    "amount": 0,
    "bloom": "0x",
    "call_result": "0x",
    "contract_id": "0.0.3548775",
    "created_contract_ids": [],
    "error_message": "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000024496e73756666696369656e7420746f6b656e2062616c616e636520666f7220776970656400000000000000000000000000000000000000000000000000000000",
    "from": "0x00000000000000000000000000000000000005ba",
    "function_parameters": "0x49257b42000000000000000000000000b7ba29e0554025e632d7db18d65d80c130f5ee940000000000000000000000000000000000000000000000000000000000007531",
    "gas_limit": 4000000,
    "gas_used": 3200000,
    "timestamp": "1677085141.263832358",
    "to": "0x0000000000000000000000000000000000362667",
    "hash": "0xcbfcdad696696893d15eefa3ea71e889cabe8e652e54f611543b5035386bc675",
    "block_hash": "0x16725d87e23dae63b20234861ccfe66874aa7e91bdd6bb8bc8e53b87d88c7499954dadce9b05c5032bcc239a31474708",
    "block_number": 1224584,
    "logs": [],
    "result": "CONTRACT_REVERT_EXECUTED",
    "transaction_index": 10,
    "state_changes": [
        {
            "address": "0x0000000000000000000000000000000000362667",
            "contract_id": "0.0.3548775",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_read": "0x0000000000000000000000000000000000000000000000000000003626680001",
            "value_written": null
        }, {
            "address": "0x0000000000000000000000000000000000362667",
            "contract_id": "0.0.3548775",
            "slot": "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
            "value_read": "0x00000000000000000000000000000000000000000000000000000000002f9ff9",
            "value_written": null
        }, {
            "address": "0x0000000000000000000000000000000000362667",
            "contract_id": "0.0.3548775",
            "slot": "0x6e6aaf3664af5268422aafc6f282e31102cd3653bc26111cdbbe2430cc92130f",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_written": null
        }, {
            "address": "0x0000000000000000000000000000000000362667",
            "contract_id": "0.0.3548775",
            "slot": "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000362666",
            "value_written": null
        }, {
            "address": "0x0000000000000000000000000000000000362667",
            "contract_id": "0.0.3548775",
            "slot": "0x00000000000000000000000000000000000000000000000000000000000000c8",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000009",
            "value_written": null
        }, {
            "address": "0x0000000000000000000000000000000000362667",
            "contract_id": "0.0.3548775",
            "slot": "0xe71fac6fb785942cc6c6404a423f94f32a28ae66d69ff41494c38bfd4788b2fb",
            "value_read": "0x515f99f4e5a381c770462a8d9879a01f0fd4a414a168a2404dab62a62e1af0c3",
            "value_written": null
        }
    ],
    "status": "0x0",
    "failed_initcode": null,
    "access_list": null,
    "block_gas_used": 3248000,
    "chain_id": null,
    "gas_price": null,
    "max_fee_per_gas": null,
    "max_priority_fee_per_gas": null,
    "r": null,
    "s": null,
    "type": null,
    "v": null,
    "nonce": null
}

export const SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES = {
    "address": null,
    "amount": 0,
    "bloom": "0x",
    "call_result": "0x",
    "contract_id": "0.0.3548775",
    "created_contract_ids": [],
    "error_message": "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003670617957697468436172644e4654202d206661696c656420746f2063616c6c2061636365707420636f6e7472616374206d6574686f6400000000000000000000",
    "from": "0x00000000000000000000000000000000000022ee",
    "function_parameters": "0x7d1ee005000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e700000000000000000000000020a269221c216afce16a83d0401af060a0d39b19000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000ddd400000000000000000000000091ba8ffb0d623d1faf3335b967e7a030d625faae00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000003039000000000000000000000000000000000000000000000000000000000000008467a47215000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "gas_limit": 0,
    "gas_used": 6400000,
    "timestamp": "1677504382.107973330",
    "to": null,
    "hash": "0x92cc800bdc94936c524bac0cbfdc15f58d9a44b53b612463c93a37a3bfccda11",
    "block_hash": "0x016839aad7c5b37220f180c90bbffcb94940dada5f0b95bc038e74e985f5005c71f160a74d0f9bdc492a9c1a3e7dd5e8",
    "block_number": 242669,
    "logs": [],
    "result": "CONTRACT_REVERT_EXECUTED",
    "transaction_index": 2,
    "state_changes": [
        {
            "address": "0x20a269221c216afce16a83d0401af060a0d39b19",
            "contract_id": "0.0.10410",
            "slot": "0x10a81eed9d63d16face5e76357905348e6253d3394086026bb2bf2145d7cc249",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_written": null
        }, {
            "address": "0x20a269221c216afce16a83d0401af060a0d39b19",
            "contract_id": "0.0.10410",
            "slot": "0x10a81eed9d63d16face5e76357905348e6253d3394086026bb2bf2145d7cc24a",
            "value_read": "0x41ba50576c59ba82f08485ca644dd627db89235fb6e216355ebb2aa88cceb961",
            "value_written": null
        }, {
            "address": "0x20a269221c216afce16a83d0401af060a0d39b19",
            "contract_id": "0.0.10410",
            "slot": "0x679795a0195a1b76cdebb7c51d74e058aee92919b8c3389af86ef24535e8a28c",
            "value_read": "0x000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e7",
            "value_written": null
        }, {
            "address": "0x91ba8ffb0d623d1faf3335b967e7a030d625faae",
            "contract_id": "0.0.33481",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_read": "0x0000000000000000000000000d51f49fda00caa1d6d80fa874593392cdd6d642",
            "value_written": null
        }, {
            "address": "0x91ba8ffb0d623d1faf3335b967e7a030d625faae",
            "contract_id": "0.0.33481",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_read": "0x0000000000000000000000000e14ce7dfb228ef3c75eda834b93d2b459f2f87b",
            "value_written": null
        }, {
            "address": "0x91ba8ffb0d623d1faf3335b967e7a030d625faae",
            "contract_id": "0.0.33481",
            "slot": "0x3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92f00",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_written": null
        }, {
            "address": "0x91ba8ffb0d623d1faf3335b967e7a030d625faae",
            "contract_id": "0.0.33481",
            "slot": "0x3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92f02",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000005f5e100",
            "value_written": null
        }, {
            "address": "0x91ba8ffb0d623d1faf3335b967e7a030d625faae",
            "contract_id": "0.0.33481",
            "slot": "0x3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92f03",
            "value_read": "0x0000000000000000000001013951c8972739d158dd344be2bbffd83c433ded98",
            "value_written": null
        }, {
            "address": "0x91ba8ffb0d623d1faf3335b967e7a030d625faae",
            "contract_id": "0.0.33481",
            "slot": "0x3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92f04",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0x000000000000000000000000000000000000000000000000000000000000000e",
            "value_read": "0x00000000000000000000000020a269221c216afce16a83d0401af060a0d39b19",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0x3f937f941661313de1d036b096a7bb3c1f721fb80d6eb05b207eaa435e37435f",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0x821c3c5d2dd65b021126d6e9e0e0c89e21605c2758f4ce1819f953167cc6047d",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0xabd6e7cb50984ff9c2f3e18a2660c3353dadf4e3291deeb275dae2cd1e44fe05",
            "value_read": "0x00000000000000000000000091ba8ffb0d623d1faf3335b967e7a030d625faae",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0xad67d757c34507f157cacfa2e3153e9f260a2244f30428821be7be64587ac55f",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0xd010d0b4ddf8a9cea49b42cfcc56c4a5e2dbb4acbd764c4ecdcc5993002fc772",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0xd9f4ee184bd0c4b0fa610180a94b9e485cced08c68a2029cb4bb0f00575754eb",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0xdcd5868f590fd217eb555c80fe5093cc2c8aa2c4763b091b8d7fe943f044f9b9",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        }, {
            "address": "0x0d51f49fda00caa1d6d80fa874593392cdd6d642",
            "contract_id": "0.0.33483",
            "slot": "0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0",
            "value_read": "0x0000000000000000000000003951c8972739d158dd344be2bbffd83c433ded98",
            "value_written": null
        }],
    "status": "0x0",
    "failed_initcode": "0x7d1ee005000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e700000000000000000000000020a269221c216afce16a83d0401af060a0d39b19000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000ddd400000000000000000000000091ba8ffb0d623d1faf3335b967e7a030d625faae00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000003039000000000000000000000000000000000000000000000000000000000000008467a47215000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "access_list": "0x",
    "block_gas_used": 6400000,
    "chain_id": "0x129",
    "gas_price": "0x08e",
    "max_fee_per_gas": "0x",
    "max_priority_fee_per_gas": "0x",
    "r": "0xe8e47814b38c05b3d19ceb722cb8617340de036e6ad6b4973d772f8f72d28c91",
    "s": "0x6db5fcc6bb7be158dab671b04e4f805d11ac389d3438fcbb530d37f0be781a49",
    "type": 0,
    "v": 0,
    "nonce": 42
}

export const SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS = {
    "actions": [
        {
            "call_depth": 0,
            "call_operation_type": "CALL",
            "call_type": "CALL",
            "caller": "0.0.8942",
            "caller_type": "ACCOUNT",
            "from": "0x00000000000000000000000000000000000022ee",
            "gas": 7979000,
            "gas_used": 121944,
            "index": 0,
            "input": "0x7d1ee005000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e700000000000000000000000020a269221c216afce16a83d0401af060a0d39b19000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000ddd400000000000000000000000091ba8ffb0d623d1faf3335b967e7a030d625faae00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000003039000000000000000000000000000000000000000000000000000000000000008467a47215000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "recipient": "0.0.10410",
            "recipient_type": "CONTRACT",
            "result_data": "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003670617957697468436172644e4654202d206661696c656420746f2063616c6c2061636365707420636f6e7472616374206d6574686f6400000000000000000000",
            "result_data_type": "REVERT_REASON",
            "timestamp": "1677504382.107973330",
            "to": "0x00000000000000000000000000000000000028aa",
            "value": 0
        }, {
            "call_depth": 1,
            "call_operation_type": "CALL",
            "call_type": "CALL",
            "caller": "0.0.10410",
            "caller_type": "CONTRACT",
            "from": "0x00000000000000000000000000000000000028aa",
            "gas": 7840814,
            "gas_used": 107842,
            "index": 1,
            "input": "0x67a47215000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000000000000",
            "recipient": "0.0.33481",
            "recipient_type": "CONTRACT",
            "result_data": "0x",
            "result_data_type": "REVERT_REASON",
            "timestamp": "1677504382.107973330",
            "to": "0x00000000000000000000000000000000000082c9",
            "value": 0
        }, {
            "call_depth": 2,
            "call_operation_type": "CALL",
            "call_type": "CALL",
            "caller": "0.0.33481",
            "caller_type": "CONTRACT",
            "from": "0x00000000000000000000000000000000000082c9",
            "gas": 7700872,
            "gas_used": 78338,
            "index": 2,
            "input": "0x23b872dd0000000000000000000000003951c8972739d158dd344be2bbffd83c433ded98000000000000000000000000e05a5852b58e13c0f039b4450192dc5cac1d88e70000000000000000000000000000000000000000000000000000000000000001",
            "recipient": "0.0.33483",
            "recipient_type": "CONTRACT",
            "result_data": "0x",
            "result_data_type": "OUTPUT",
            "timestamp": "1677504382.107973330",
            "to": "0x00000000000000000000000000000000000082cb",
            "value": 0
        }], "links": {"next": null}
}


export const SAMPLE_ERROR_RESULTS = {
    "results": [
        {
            "address": null,
            "amount": 0,
            "bloom": "0x",
            "call_result": "0x",
            "contract_id": null,
            "created_contract_ids": [],
            "error_message": "INSUFFICIENT_GAS",
            "from": "0x0000000000000000000000000000000000000386",
            "function_parameters": "0xd09de08a",
            "gas_limit": 21500,
            "gas_used": 21500,
            "timestamp": "1685737274.278536163",
            "to": null,
            "hash": "0x9059179bccd15bfabb246dd24572f4556cbf3a5dbb1d335759e593a7a6a8abed"
        }
    ],
    "links": {
        "next": null
    }
}

// https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=2&transactiontype=CRYPTOTRANSFER

export const SAMPLE_CRYPTO_TRANSACTIONS = {
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 78643,
            "consensus_timestamp": "1646746059.558562000",
            "entity_id": null,
            "max_fee": "4000000",
            "memo_base64": "",
            "name": "CRYPTOTRANSFER",
            "node": "0.0.17",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "RYfHjZoGCeAr9K1CNwVMztmx/F2im7Ae3yHkI3thlluzucsoP0uEuj3bKq+Qh84x",
            "transaction_id": "0.0.14622-1646746046-722961649",
            "transfers": [
                {
                    "account": "0.0.17",
                    "amount": 2017
                },
                {
                    "account": "0.0.98",
                    "amount": 76626
                },
                {
                    "account": "0.0.14622",
                    "amount": -78643
                },
                {
                    "account": "0.0.14684",
                    "amount": 90000
                },
                {
                    "account": "0.0.14698",
                    "amount": -90000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646746046.722961649"
        },
        {
            "bytes": null,
            "charged_tx_fee": 78643,
            "consensus_timestamp": "1646746059.040288661",
            "entity_id": null,
            "max_fee": "4000000",
            "memo_base64": "",
            "name": "CRYPTOTRANSFER",
            "node": "0.0.5",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "+eQ70U7gSMiSavPTAr1RoKsWipe3H/oef5CiZ051Xli73Dc0XxXdQPnwT8Sml9sE",
            "transaction_id": "0.0.19852-1646746046-457048377",
            "transfers": [
                {
                    "account": "0.0.5",
                    "amount": 2017
                },
                {
                    "account": "0.0.98",
                    "amount": 76626
                },
                {
                    "account": "0.0.14684",
                    "amount": 90000
                },
                {
                    "account": "0.0.14698",
                    "amount": -90000
                },
                {
                    "account": "0.0.19852", "amount": -78643
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646746046.457048377"
        }
    ]
}

// https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=2&transactiontype=CONSENSUSSUBMITMESSAGE

export const SAMPLE_MESSAGE_TRANSACTIONS = {
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 81424,
            "consensus_timestamp": "1646747943.996963039",
            "entity_id": "0.0.120438",
            "max_fee": "4000000",
            "memo_base64": "",
            "name": "CONSENSUSSUBMITMESSAGE",
            "node": "0.0.3",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "HGSDoR+EX3JmeINOPf7nxfD0SSsTWDQ3u02iPudAluSvIeu3yE0Is0P6lu1jlyvA",
            "transaction_id": "0.0.41104-1646747931-190710543",
            "transfers": [{"account": "0.0.3", "amount": 2705}, {
                "account": "0.0.98",
                "amount": 78719
            }, {"account": "0.0.41104", "amount": -81424}],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646747931.190710543"
        },
        {
            "bytes": null,
            "charged_tx_fee": 81340,
            "consensus_timestamp": "1646747943.962210931",
            "entity_id": "0.0.120438",
            "max_fee": "4000000",
            "memo_base64": "",
            "name": "CONSENSUSSUBMITMESSAGE",
            "node": "0.0.15",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "pgHT3L9tuWlYidtXt9uP5Q1v8MsJvQjMfN5wZBxb53J6MwlZfyY7xUokMej6J/hO",
            "transaction_id": "0.0.41099-1646747932-228613829",
            "transfers": [{"account": "0.0.15", "amount": 2700}, {
                "account": "0.0.98",
                "amount": 78640
            }, {"account": "0.0.41099", "amount": -81340}],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646747932.228613829"
        }
    ]
}

// https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=2&transactiontype=CONSENSUSCREATETOPIC

export const SAMPLE_CREATETOPIC_TRANSACTIONS = {
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 4787240,
            "consensus_timestamp": "1646676908.667585920",
            "entity_id": "0.0.750040",
            "max_fee": "200000000",
            "memo_base64": "",
            "name": "CONSENSUSCREATETOPIC",
            "node": "0.0.5",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "kU7imDB9zIs8ocmjh+vJLHBubopaGVPEm7Sg4UliizruYRbD0FeiFrF6SwUDgN4w",
            "transaction_id": "0.0.636139-1646676896-310548965",
            "transfers": [{"account": "0.0.5", "amount": 231332}, {
                "account": "0.0.98",
                "amount": 4555908
            }, {"account": "0.0.636139", "amount": -4787240}],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646676896.310548965"
        },
        {
            "bytes": null,
            "charged_tx_fee": 5325187,
            "consensus_timestamp": "1646666058.899406000",
            "entity_id": "0.0.749794",
            "max_fee": "2000000000",
            "memo_base64": "TWlycm9yIE5vZGUgYWNjZXB0YW5jZSB0ZXN0OiAyMDIyLTAzLTA3VDE1OjE0OjE4LjE2NzU1NTA1OFogQ3JlYXRlIFRvcGlj",
            "name": "CONSENSUSCREATETOPIC",
            "node": "0.0.3",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "Bj5AhikOLdBux8XYp8XNzK8wzCfX0ForHEIRb/QkkaFatWBbbhJ1yCee0y2Rc0IS",
            "transaction_id": "0.0.950-1646666046-105179272",
            "transfers": [{"account": "0.0.3", "amount": 247218}, {
                "account": "0.0.98",
                "amount": 5077969
            }, {"account": "0.0.950", "amount": -5325187}],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646666046.105179272"
        }
    ]
}

export const SAMPLE_REWARDS_TRANSACTIONS = {
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 78643,
            "consensus_timestamp": "1646746059.558562000",
            "entity_id": null,
            "max_fee": "4000000",
            "memo_base64": "",
            "name": "CRYPTOTRANSFER",
            "node": "0.0.17",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "RYfHjZoGCeAr9K1CNwVMztmx/F2im7Ae3yHkI3thlluzucsoP0uEuj3bKq+Qh84x",
            "transaction_id": "0.0.14622-1646746046-722961649",
            "transfers": [
                {
                    "account": "0.0.17",
                    "amount": 2017
                },
                {
                    "account": "0.0.98",
                    "amount": 76626
                },
                {
                    "account": "0.0.14622",
                    "amount": -78643
                },
                {
                    "account": "0.0.800",
                    "amount": -123456789,
                    "is_approval": false
                },
                {
                    "account": "0.0.15818224",
                    "amount": 123456789,
                    "is_approval": false
                },
                {
                    "account": "0.0.14684",
                    "amount": 90000
                },
                {
                    "account": "0.0.14698",
                    "amount": -90000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646746046.722961649"
        },
        {
            "bytes": null,
            "charged_tx_fee": 273792,
            "consensus_timestamp": "1660577929.534382083",
            "entity_id": "0.0.47813131",
            "max_fee": "200000000",
            "memo_base64": "",
            "name": "CRYPTOUPDATEACCOUNT",
            "node": "0.0.3",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "j7iGcapZ01hw9tAmf5P1cojq3NEeONl5i43oBrknSD3uaPaS9BzKjkoEG4SHVWr3",
            "transaction_id": "0.0.47813131-1660577918-385318328",
            "transfers": [
                {
                    "account": "0.0.3",
                    "amount": 11070,
                    "is_approval": false
                },
                {
                    "account": "0.0.98",
                    "amount": 262722,
                    "is_approval": false
                },
                {
                    "account": "0.0.800",
                    "amount": -2334450720,
                    "is_approval": false
                },
                {
                    "account": "0.0.15818224",
                    "amount": 2334450720,
                    "is_approval": false
                },
                {
                    "account": "0.0.47813131",
                    "amount": -273792,
                    "is_approval": false
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1660577918.385318328"
        },
        {
            "bytes": null,
            "charged_tx_fee": 78643,
            "consensus_timestamp": "1646746059.040288661",
            "entity_id": null,
            "max_fee": "4000000",
            "memo_base64": "",
            "name": "CRYPTOTRANSFER",
            "node": "0.0.5",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "+eQ70U7gSMiSavPTAr1RoKsWipe3H/oef5CiZ051Xli73Dc0XxXdQPnwT8Sml9sE",
            "transaction_id": "0.0.19852-1646746046-457048377",
            "transfers": [
                {
                    "account": "0.0.5",
                    "amount": 2017
                },
                {
                    "account": "0.0.98",
                    "amount": 76626
                },
                {
                    "account": "0.0.14684",
                    "amount": 90000
                },
                {
                    "account": "0.0.800",
                    "amount": -234567890,
                    "is_approval": false
                },
                {
                    "account": "0.0.15818224",
                    "amount": 234567890,
                    "is_approval": false
                },
                {
                    "account": "0.0.14698",
                    "amount": -90000
                },
                {
                    "account": "0.0.19852", "amount": -78643
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1646746046.457048377"
        }
    ]
}

//
// https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/0.0.48113503-1662470948-432078184
//

export const SAMPLE_PARENT_CHILD_TRANSACTIONS: TransactionResponse = {
    "transactions":
        [{
            "bytes": null,
            "charged_tx_fee": 160800000,
            "consensus_timestamp": "1662470957.014478705",
            "entity_id": "0.0.48193749",
            "max_fee": "200000000",
            "memo_base64": "",
            "name": TransactionType.CONTRACTCALL,
            "nft_transfers": [],
            "node": "0.0.5",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "jthcv17LsslWUAzQkuIzeVMFpwJ3Uf5g6sSp1aZ8qqSWTz52XhPaMGAzt/5UgYob",
            "transaction_id": "0.0.48113503-1662470948-432078184",
            "transfers": [{"account": "0.0.98", "amount": 160800000, "is_approval": false}, {
                "account": "0.0.48113503",
                "amount": -5160800000,
                "is_approval": false
            }, {"account": "0.0.48193749", "amount": 5000000000, "is_approval": false}],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1662470948.432078184"
        }, {
            "bytes": null,
            "charged_tx_fee": 0,
            "consensus_timestamp": "1662470957.014478706",
            "entity_id": "0.0.48193741",
            "max_fee": "0",
            "memo_base64": "",
            "name": TransactionType.TOKENMINT,
            "nft_transfers": [{
                "is_approval": false,
                "receiver_account_id": "0.0.48113503",
                "sender_account_id": null,
                "serial_number": 1,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48113503",
                "sender_account_id": null,
                "serial_number": 2,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48113503",
                "sender_account_id": null,
                "serial_number": 3,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48113503",
                "sender_account_id": null,
                "serial_number": 4,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48113503",
                "sender_account_id": null,
                "serial_number": 5,
                "token_id": "0.0.48193741"
            }],
            "node": null,
            "nonce": 1,
            "parent_consensus_timestamp": "1662470957.014478705",
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "gLobKtgAWqka6N/3K5o2TS8XKeQIafH8wxkzZfycRJcOfJ7vccaR/6drUU8j6Xci",
            "transaction_id": "0.0.48113503-1662470948-432078184",
            "transfers": [],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1662470948.432078184"
        }, {
            "bytes": null,
            "charged_tx_fee": 0,
            "consensus_timestamp": "1662470957.014478707",
            "entity_id": null,
            "max_fee": "0",
            "memo_base64": "",
            "name": TransactionType.CRYPTOTRANSFER,
            "nft_transfers": [{
                "is_approval": false,
                "receiver_account_id": "0.0.48193739",
                "sender_account_id": "0.0.48113503",
                "serial_number": 1,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48193739",
                "sender_account_id": "0.0.48113503",
                "serial_number": 2,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48193739",
                "sender_account_id": "0.0.48113503",
                "serial_number": 3,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48193739",
                "sender_account_id": "0.0.48113503",
                "serial_number": 4,
                "token_id": "0.0.48193741"
            }, {
                "is_approval": false,
                "receiver_account_id": "0.0.48193739",
                "sender_account_id": "0.0.48113503",
                "serial_number": 5,
                "token_id": "0.0.48193741"
            }],
            "node": null,
            "nonce": 2,
            "parent_consensus_timestamp": "1662470957.014478705",
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "Gqep6H2B3iE4id1qPG92q51LP20WXW7r53ujWlKekk8RBhYTfpFiD4iJBkK8UnGc",
            "transaction_id": "0.0.48113503-1662470948-432078184",
            "transfers": [],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1662470948.432078184"
        }],
    "links": {
        next: null
    }
}

//
// https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/0.0.503733-1666754898-238965661
//

export const SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS: TransactionResponse = {
    "transactions": [{
        "bytes": null,
        "charged_tx_fee": 10222951,
        "consensus_timestamp": "1666754908.576858590",
        "entity_id": "0.0.1382775",
        "max_fee": "500000000",
        "memo_base64": "",
        "name": TransactionType.SCHEDULECREATE,
        "nft_transfers": [],
        "node": "0.0.22",
        "nonce": 0,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "kf0Uakt9YM0AztfHZanJXU9Rk5nmX0ZFjiyvGGHPPeZI/gdSTy+ThDAsLT1p7yfx",
        "transaction_id": "0.0.503733-1666754898-238965661",
        "transfers": [{"account": "0.0.22", "amount": 513563, "is_approval": false}, {
            "account": "0.0.98",
            "amount": 9709388,
            "is_approval": false
        }, {"account": "0.0.503733", "amount": -10222951, "is_approval": false}],
        "valid_duration_seconds": "120",
        "valid_start_timestamp": "1666754898.238965661"
    }, {
        "bytes": null,
        "charged_tx_fee": 250757,
        "consensus_timestamp": "1666754925.508764007",
        "entity_id": "0.0.1304757",
        "max_fee": "3000000000",
        "memo_base64": "",
        "name": TransactionType.TOKENMINT,
        "nft_transfers": [],
        "node": null,
        "nonce": 0,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": true,
        "staking_reward_transfers": [],
        "token_transfers": [{
            "token_id": "0.0.1304757",
            "account": "0.0.540219",
            "amount": 404955647,
            "is_approval": false
        }],
        "transaction_hash": "88cs2fTZgAV2fh+n7zWhZjPs24NDyq6icaP/CR64SR5vruiiKoHB3Ip6oid5DMfa",
        "transaction_id": "0.0.503733-1666754898-238965661",
        "transfers": [{"account": "0.0.98", "amount": 250757, "is_approval": false}, {
            "account": "0.0.540286",
            "amount": -250757,
            "is_approval": false
        }],
        "valid_duration_seconds": "120",
        "valid_start_timestamp": "1666754898.238965661"
    }],
    "links": {
        "next": null
    }
}

export const SAMPLE_SCHEDULE: Schedule = {
    "admin_key": null,
    "deleted": false,
    "consensus_timestamp": "1666754908.576858590",
    "creator_account_id": "0.0.503733",
    "executed_timestamp": "1666754925.508764007",
    "expiration_time": null,
    "memo": "",
    "payer_account_id": "0.0.540286",
    "schedule_id": "0.0.1382775",
    "signatures": [{
        "consensus_timestamp": "1666754925.508764000",
        "public_key_prefix": "AsevvtoymvMCmYe9+MTyyAmv0GhXiIeLcmjnsHAz2TL6",
        "signature": "CtdYldUBNrDUv14pAX5N4XDYOiboEkDAPVelVrNa9IRSH+z72wkCk1q06GTgzDYZ8RlpBDjFIYlK\naHYs2Rsl9w==",
        "type": SignatureType.ECDSA_SECP256K1
    }, {
        "consensus_timestamp": "1666754925.508764002",
        "public_key_prefix": "AtGoyN6a6njsqjz61ZOI+H2MxHT+ttSaCPH8TpdPXRxi",
        "signature": "Eib7p24XNyULTvlygVY5iQMcA5KHQy/0WqID1yGG0YheImuWg28XwB7sQ0QLLPK7WISaxdqXI85r\nDGpaCgDZ5w==",
        "type": SignatureType.ECDSA_SECP256K1
    }],
    "transaction_body": "CIDC1y8SJDE5MmEyMzBiLTQzYTAtNDkwYS1iMDcwLWEzMjdlMjI3NjNkZUo8CjoKHQoWIhQQBSQ38M0RvDemJfugI1pv6epzjhCA0coICgsKBRjdvY0CEICJegoMCgUY9YjfAhD/2cQJ",
    "wait_for_expiry": false
}

export const SCHEDULE_TRANSACTION_BODY = {
    "transactionFee": {
        "low": 100000000,
        "high": 0,
        "unsigned": true
    },
    "memo": "192a230b-43a0-490a-b070-a327e22763de",
    "cryptoTransfer": {
        "tokenTransfers": [],
        "transfers": {
            "accountAmounts": [
                {
                    "accountID": {
                        "alias": {
                            "0": 16,
                            "1": 5,
                            "2": 36,
                            "3": 55,
                            "4": 240,
                            "5": 205,
                            "6": 17,
                            "7": 188,
                            "8": 55,
                            "9": 166,
                            "10": 37,
                            "11": 251,
                            "12": 160,
                            "13": 35,
                            "14": 90,
                            "15": 111,
                            "16": 233,
                            "17": 234,
                            "18": 115,
                            "19": 142
                        }
                    },
                    "amount": {
                        "low": 9000000,
                        "high": 0,
                        "unsigned": false
                    }
                },
                {
                    "accountID": {
                        "accountNum": {
                            "low": 4415197,
                            "high": 0,
                            "unsigned": false
                        }
                    },
                    "amount": {
                        "low": 1000000,
                        "high": 0,
                        "unsigned": false
                    }
                },
                {
                    "accountID": {
                        "accountNum": {
                            "low": 5751925,
                            "high": 0,
                            "unsigned": false
                        }
                    },
                    "amount": {
                        "low": -10000000,
                        "high": -1,
                        "unsigned": false
                    }
                }
            ]
        }
    }
}

//
// http://testnet.mirrornode.hedera.com/api/v1/transactions/0.0.2520793-1665085799-890453831
//

export const SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS = {
    "transactions": [{
        "bytes": null,
        "charged_tx_fee": 141509235,
        "consensus_timestamp": "1665085808.019403093",
        "entity_id": null,
        "max_fee": "10000000000",
        "memo_base64": "",
        "name": "CRYPTODELETEALLOWANCE",
        "nft_transfers": [],
        "node": "0.0.4",
        "nonce": 0,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "KuwQ5qibGSidcXJKP62s3aBPA+xIcN+EnH/GDXnN2+2hS5UlRRKtY+TlIurY9Vyo",
        "transaction_id": "0.0.2520793-1665085799-890453831",
        "transfers": [{"account": "0.0.4", "amount": 3630931, "is_approval": false}, {
            "account": "0.0.98",
            "amount": 137878304,
            "is_approval": false
        }, {"account": "0.0.2520793", "amount": -141509235, "is_approval": false}],
        "valid_duration_seconds": "120",
        "valid_start_timestamp": "1665085799.890453831"
    }, {
        "bytes": null,
        "charged_tx_fee": 0,
        "consensus_timestamp": "1665085808.019403094",
        "entity_id": "0.0.534101",
        "max_fee": "0",
        "memo_base64": "",
        "name": "CONTRACTDELETEINSTANCE",
        "nft_transfers": [],
        "node": null,
        "nonce": 1,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "QCcVBlDByJ9a+GbYmTwoSzBt8teJmS4r5j2IF0SidtfmkNAjDNnoIcWFnWm/wCQk",
        "transaction_id": "0.0.2520793-1665085799-890453831",
        "transfers": [],
        "valid_duration_seconds": null,
        "valid_start_timestamp": "1665085799.890453831"
    }, {
        "bytes": null,
        "charged_tx_fee": 0,
        "consensus_timestamp": "1665085808.019403095",
        "entity_id": "0.0.534103",
        "max_fee": "0",
        "memo_base64": "",
        "name": "CONTRACTDELETEINSTANCE",
        "nft_transfers": [],
        "node": null,
        "nonce": 2,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "tJWvi9tJwnT3Wnmi6wBj8qo8kItCzdBSdHnISaJfRxB+kyKmHa81Pak3VwjCxh8P",
        "transaction_id": "0.0.2520793-1665085799-890453831",
        "transfers": [],
        "valid_duration_seconds": null,
        "valid_start_timestamp": "1665085799.890453831"
    }]
}
//
// TOKEN ASSOCIATE Transaction inspired from https://hashscan-latest.hedera-devops.com/testnet/transaction/1671648712.150557003
//

export const SAMPLE_TOKEN_ASSOCIATE_TRANSACTION = {
    "bytes": null,
    "charged_tx_fee": 115905210,
    "consensus_timestamp": "1671648712.150557003",
    "entity_id": "0.0.642949",
    "max_fee": "500000000",
    "memo_base64": "",
    "name": "TOKENASSOCIATE",
    "nft_transfers": [],
    "node": "0.0.3",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "SUCCESS",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [],
    "transaction_hash": "R4YHmZnfFpo4NJJJ08mlSJqD8cfFG2se3rgTR6SW2TGD4kpDrQM3LrxQFSimAy3r",
    "transaction_id": "0.0.642949-1671648699-088023490",
    "transfers": [{"account": "0.0.3", "amount": 5805847, "is_approval": false}, {
        "account": "0.0.98",
        "amount": 110099363,
        "is_approval": false
    }, {"account": "0.0.642949", "amount": -115905210, "is_approval": false}],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1671648699.088023490"
}

export const SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT = {
    "transactions": [{
        "bytes": null,
        "charged_tx_fee": 289885506,
        "consensus_timestamp": "1680856113.083079074",
        "entity_id": "0.0.1736",
        "max_fee": "1965000000",
        "memo_base64": "",
        "name": "ETHEREUMTRANSACTION",
        "nft_transfers": [],
        "node": "0.0.9",
        "nonce": 0,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "eCUqd8lk6CpS7/s9RJ3ZsKaeCXUqleE3Jpz5MzrkULc4xLI+B77Rrqd0rcmB0G7l",
        "transaction_id": "0.0.902-1680856100-967831537",
        "transfers": [
            {
                "account": "0.0.9", "amount": 2904321, "is_approval": false
            },
            {
                "account": "0.0.98",
                "amount": 286981185,
                "is_approval": false
            },
            {
                "account": "0.0.902", "amount": -81885506, "is_approval": false
            },
            {
                "account": "0.0.1736",
                "amount": 999100000000,
                "is_approval": false
            },
            {
                "account": "0.0.3950761", "amount": -999308000000, "is_approval": false
            }
        ],
        "valid_duration_seconds": "120",
        "valid_start_timestamp": "1680856100.967831537"
    }], "links": {"next": null}
}

export const SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT = {
    "transactions": [{
        "bytes": null,
        "charged_tx_fee": 134305262,
        "consensus_timestamp": "1680856204.729061756",
        "entity_id": "0.0.3982005",
        "max_fee": "1965000000",
        "memo_base64": "",
        "name": "ETHEREUMTRANSACTION",
        "nft_transfers": [],
        "node": "0.0.3",
        "nonce": 0,
        "parent_consensus_timestamp": null,
        "result": "SUCCESS",
        "scheduled": false,
        "staking_reward_transfers": [],
        "token_transfers": [],
        "transaction_hash": "4EWj/Lk9U/Iqg+uidRapSKXbxrfJfiXxUSl9gV+p2cgDGVMg0ioUWAH8gJy7asiG",
        "transaction_id": "0.0.3675516-1680856194-531027354",
        "transfers": [
            {
                "account": "0.0.3", "amount": 5150432, "is_approval": false
            },
            {
                "account": "0.0.98",
                "amount": 129154830,
                "is_approval": false
            },
            {
                "account": "0.0.3675516", "amount": -87505262, "is_approval": false
            },
            {
                "account": "0.0.3763630",
                "amount": -46800000,
                "is_approval": false
            }
        ],
        "valid_duration_seconds": "120",
        "valid_start_timestamp": "1680856194.531027354"
    }], "links": {"next": null}
}

export const SAMPLE_ASSOCIATED_TOKEN = {
    "admin_key": {"_type": "ED25519", "key": "c350fb04dc8b75e0f2bae193f42f6d08c337bd627f731b19a67231cffe325ebe"},
    "auto_renew_account": "0.0.1856648",
    "auto_renew_period": 7776000,
    "created_timestamp": "1651133913.387572000",
    "custom_fees": {"created_timestamp": "1651133913.387572000", "fixed_fees": [], "fractional_fees": []},
    "decimals": "4",
    "deleted": false,
    "expiry_timestamp": "1658909913.387572000",
    "fee_schedule_key": {"_type": "ED25519", "key": "d0475f0732bd44a9e0a817c8e670e5372b3bf2631f71fb6966d71e8a56e71845"},
    "freeze_default": false,
    "freeze_key": {"_type": "ED25519", "key": "e46e5f2c3ca46d68c814ee2d645ad59c8b5441c99fc193321659f620e6468a7d"},
    "initial_supply": "500000000000000",
    "kyc_key": null,
    "max_supply": "500000000000000",
    "memo": "",
    "modified_timestamp": "1664459798.418712003",
    "name": "HSUITE",
    "nft_transfers": [],
    "pause_key": {"_type": "ED25519", "key": "8d2e8b0cc2518eb79d4ab07188387fe6f297ca230bd2f9b1faf31f889bf65f40"},
    "pause_status": "UNPAUSED",
    "supply_key": {"_type": "ED25519", "key": "f53f56ca2a83399aff9163c15a3868135a6d0589ce011e4eb2e98166148039d2"},
    "supply_type": "FINITE",
    "symbol": "HSuite",
    "token_id": "0.0.34332104",
    "total_supply": "500000000000000",
    "treasury_account_id": "0.0.34332092",
    "type": "FUNGIBLE_COMMON",
    "wipe_key": {"_type": "ED25519", "key": "fd5f6414ae9437854b31c81251b5e4be7b56a435dd749473da6feeecd85d6eaf"}
}

export const SAMPLE_ASSOCIATED_TOKEN_2 = {
    "admin_key": null,
    "auto_renew_account": "0.0.49288723",
    "auto_renew_period": 7776000,
    "created_timestamp": "1673613321.257283003",
    "custom_fees": {"created_timestamp": "1673613321.257283003", "fixed_fees": [], "fractional_fees": []},
    "decimals": "8",
    "deleted": false,
    "expiry_timestamp": "1681389321257283003",
    "fee_schedule_key": null,
    "freeze_default": false,
    "freeze_key": null,
    "initial_supply": "20000000000000",
    "kyc_key": null,
    "max_supply": "0",
    "memo": "",
    "modified_timestamp": "1673613321.257283003",
    "name": "Token SymbolA7",
    "nft_transfers": [],
    "pause_key": null,
    "pause_status": "NOT_APPLICABLE",
    "supply_key": {"_type": "ED25519", "key": "2e61deb649eee47b0693d878fc5b2d8baa733f5e7b625314519064616ead62fe"},
    "supply_type": "INFINITE",
    "symbol": "TokenA7",
    "token_id": "0.0.49292859",
    "total_supply": "20000000000000",
    "treasury_account_id": "0.0.49288723",
    "type": "FUNGIBLE_COMMON",
    "wipe_key": null
}

//
// Inspired from https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.642949/tokens
//

export const SAMPLE_TOKEN_RELATIONSHIP_1 = {
    "automatic_association": false,
    "balance": 2342647909,
    "created_timestamp": SAMPLE_TOKEN_ASSOCIATE_TRANSACTION.consensus_timestamp,
    "freeze_status": "UNFROZEN",
    "kyc_status": "NOT_APPLICABLE",
    "token_id": SAMPLE_ASSOCIATED_TOKEN.token_id
}

export const SAMPLE_TOKEN_RELATIONSHIP_2 = {
    "automatic_association": false,
    "balance": 31669471,
    "created_timestamp": "1671648712.150557003",
    "freeze_status": "UNFROZEN",
    "kyc_status": "NOT_APPLICABLE",
    "token_id": SAMPLE_ASSOCIATED_TOKEN_2.token_id
}

export const SAMPLE_TOKEN_RELATIONSHIP_RESPONSE = {
    "tokens": [
        SAMPLE_TOKEN_RELATIONSHIP_1,
        SAMPLE_TOKEN_RELATIONSHIP_2
    ],
    "links": {
        next: null
    }
}

//
// Account inspired from: https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.730631
//

export const SAMPLE_ACCOUNT = {
    "account": "0.0.730631",
    "alias": "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ",
    "auto_renew_period": 7776000,
    "balance": {
        "balance": 2342647909,
        "timestamp": "1646333100.356842286",
        "tokens": [
            {
                "token_id": SAMPLE_TOKEN.token_id,
                "balance": 10
            }
        ]
    },
    "created_timestamp": "1646025151.667604000",
    "deleted": false,
    "expiry_timestamp": null,
    "key":
        {
            "_type": "ED25519",
            "key": "aa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbf"
        },
    "max_automatic_token_associations": 0,
    "memo": "",
    "receiver_sig_required": false,
    "evm_address": "0x00000000000000000000000000000000000b2607",
    "ethereum_nonce": 0,
    "decline_reward": null,
    "staked_node_id": null,
    "staked_account_id": null,
    "stake_period_start": null
}

//
// Account inspired from: https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.730632
//

export const SAMPLE_ACCOUNT_DUDE = {
    "account": "0.0.730632",
    "alias": null,
    "auto_renew_period": 6666000,
    "balance": {
        "balance": 31669471,
        "timestamp": "1648548001.410978000",
        "tokens": [
            {
                "token_id": SAMPLE_TOKEN_DUDE,
                "balance": 99000000
            }
        ]
    },
    "deleted": false,
    "expiry_timestamp": "1649648001.410978000",
    "key": {"_type": "ED25519", "key": "38f1ea460e95d97eea13aefac760eaf990154b80a3608ab01d4a264944d68746"},
    "max_automatic_token_associations": -1,
    "memo": "Account Dude Memo in clear",
    "receiver_sig_required": true,
    "evm_address": null,
    "ethereum_nonce": null,
    "decline_reward": null,
    "staked_node_id": null,
    "staked_account_id": null,
    "stake_period_start": null
}

export const SAMPLE_ACCOUNT_DELETED = {
    "account": "0.0.730632",
    "alias": null,
    "auto_renew_period": 6666000,
    "balance": {
        "balance": 31669471,
        "timestamp": "1648548001.410978000",
        "tokens": [
            {
                "token_id": SAMPLE_TOKEN_DUDE,
                "balance": 99000000
            }
        ]
    },
    "deleted": true,
    "expiry_timestamp": "1649648001.410978000",
    "key": {"_type": "ED25519", "key": "38f1ea460e95d97eea13aefac760eaf990154b80a3608ab01d4a264944d68746"},
    "max_automatic_token_associations": 10,
    "memo": "Account Dude Memo in clear",
    "receiver_sig_required": true,
    "evm_address": null,
    "ethereum_nonce": null,
    "decline_reward": null,
    "staked_node_id": null,
    "staked_account_id": null,
    "stake_period_start": null
}

export const SAMPLE_ACCOUNT_STAKING_NODE = {
    "account": "0.0.730632",
    "alias": null,
    "auto_renew_period": 6666000,
    "balance": {
        "balance": 31669471,
        "timestamp": "1648548001.410978000",
        "tokens": []
    },
    "deleted": false,
    "expiry_timestamp": "1649648001.410978000",
    "key": {"_type": "ED25519", "key": "38f1ea460e95d97eea13aefac760eaf990154b80a3608ab01d4a264944d68746"},
    "max_automatic_token_associations": 10,
    "memo": "Account staking to node",
    "receiver_sig_required": true,
    "evm_address": null,
    "ethereum_nonce": null,
    "decline_reward": false,
    "staked_node_id": 1,
    "staked_account_id": null,
    "stake_period_start": "1668124800.000000000",
    "pending_reward": 12345678
}

export const SAMPLE_ACCOUNT_STAKING_ACCOUNT = {
    "account": "0.0.730632",
    "alias": null,
    "auto_renew_period": 6666000,
    "balance": {
        "balance": 31669471,
        "timestamp": "1648548001.410978000",
        "tokens": []
    },
    "deleted": false,
    "expiry_timestamp": "1649648001.410978000",
    "key": {"_type": KeyType.ED25519, "key": "38f1ea460e95d97eea13aefac760eaf990154b80a3608ab01d4a264944d68746"},
    "max_automatic_token_associations": 10,
    "memo": "Account staking to account",
    "receiver_sig_required": true,
    "evm_address": null,
    "ethereum_nonce": null,
    "decline_reward": true,
    "staked_node_id": null,
    "staked_account_id": "0.0.5",
    "stake_period_start": null,
    "pending_reward": 0,
    "created_timestamp": null
}

export const SAMPLE_ACCOUNTS = {
    "accounts": [
        SAMPLE_ACCOUNT
    ]
}

export const SAMPLE_ACCOUNT_BALANCES = {
    "timestamp": "1646728200.821070000",
    "balances": [
        {
            "account": "0.0.730631",
            "balance": 2342647909,
            "tokens": [
                {
                    "token_id": SAMPLE_TOKEN.token_id,
                    "balance": 998
                },
                {
                    "token_id": SAMPLE_NONFUNGIBLE.token_id,
                    "balance": 1
                }
            ]
        }
    ]
}

export const SAMPLE_ACCOUNT_HBAR_BALANCE = {
    "timestamp": "1646728200.821070000",
    "balances": [
        {
            "account": "0.0.730631",
            "balance": 2342647909,
            "tokens": []
        }
    ]
}

// Inspired from https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.49058639?limit=1

export const SAMPLE_ACCOUNT_PROTOBUF_KEY = {
    "account": "0.0.49058639",
    "alias": null,
    "auto_renew_period": 7800000,
    "balance": {"balance": 49981802457, "timestamp": "1674730033.376862693", "tokens": []},
    "created_timestamp": "1670544262.122458003",
    "decline_reward": false,
    "deleted": false,
    "ethereum_nonce": 0,
    "evm_address": null,
    "expiry_timestamp": "1678344262.122458003",
    "key": {
        "_type": "ProtobufEncoded",
        "key": "2aa2040802129d040a221220d40d60cfe24c1e6e63eddbbbb857c6540759e02514b1a151d8147f07d4e3eaee0ad2032acf03080112ca030a221220775334a1a5d250c3bfc75b8b81fa2d5fc8fed7d5dab4b2a5ec272aa952aa377c0a2212205b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d10a2212203aa16f6f6cf5b95057ba1854cf5822a446d082b37212a3f1c164babadb713f870a93023290020a221220b3a3e302a74198085e0752495528a6bc475b6bc1f4ba9ae246d9235e5a45e43c0a221220b31d0cfc76ea431928330adfc3094780985876c87864bfe094f956dee4e05d9a0a221220c5b759fee0f23620330deea250bd1a66602f8d847bc181482e268d63e16ae16a0aa101329e010a9b013298010a722a700801126c0a221220b5d243760381ec28f8df73ca2707761720482612071fead9a8a14ff1e0c2f36a0a2212202f170df8b57ee630c42e408a6fc749e4ee62174fce66b9e03c9d9b4e68d35d400a221220bce139f0d9e6d69076f8915fcc32209ade6debaca3f05ee5a713e652b65e73290a221220a4c8bfd29c164be686c18d9ddbb09c3a47a375a57f32f6df6aec9ccef80f817c0a221220c5040cb52c20d2ab9496893fca0b690cb13855e6e55231e63360c3976e64a25c0a22122078b769551a81d0fd10c3b5390abb3de92ed4878977a119c2be2039247d8182da0a2212205b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d1"
    },
    "max_automatic_token_associations": 0,
    "memo": "",
    "pending_reward": 0,
    "receiver_sig_required": false,
    "staked_account_id": null,
    "staked_node_id": null,
    "stake_period_start": null,
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 971936,
            "consensus_timestamp": "1670947193.071052939",
            "entity_id": "0.0.49058639",
            "max_fee": "500000000",
            "memo_base64": "",
            "name": "CRYPTOUPDATEACCOUNT",
            "nft_transfers": [],
            "node": "0.0.3",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "A/brQJF7Fx5BW/u6556mOOrcEZib5icD4sgBlII7hXhnqGJiQ6MrJezJ/FFCUdZ8",
            "transaction_id": "0.0.49058639-1670947192-898000000",
            "transfers": [{"account": "0.0.3", "amount": 210956, "is_approval": false}, {
                "account": "0.0.98",
                "amount": 760980,
                "is_approval": false
            }, {"account": "0.0.49058639", "amount": -971936, "is_approval": false}],
            "valid_duration_seconds": "180",
            "valid_start_timestamp": "1670947192.898000000"
        }],
    "links": {"next": "/api/v1/accounts/0.0.49058639?limit=1&timestamp=lt:1670947193.071052939"}
}

//
// Account inspired from: https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0xe6d5514b8de7ef9e5f5c4cc2e8ca0207129deb65
//

export const SAMPLE_ACCOUNT_WITH_NATIVE_EVM_ADDRESS = {
    "account": "0.0.2957798",
    "alias": "43KVCS4N47XZ4X24JTBORSQCA4JJ323F",
    "auto_renew_period": 7776000,
    "balance": {"balance": 3457440000, "timestamp": "1686309927.971781003", "tokens": []},
    "created_timestamp": "1685800751.186366002",
    "decline_reward": false,
    "deleted": false,
    "ethereum_nonce": 3,
    "evm_address": "0xe6d5514b8de7ef9e5f5c4cc2e8ca0207129deb65",
    "expiry_timestamp": "1693576751.186366002",
    "key": {"_type": "ECDSA_SECP256K1", "key": "0332efb3b38121d96bb000050f50e402730939dbaf206a8a77b4cfe7d510b6cfb7"},
    "max_automatic_token_associations": 0,
    "memo": "lazy-created account",
    "pending_reward": 0,
    "receiver_sig_required": false,
    "staked_account_id": null,
    "staked_node_id": null,
    "stake_period_start": null,
    "transactions": [],
    "links": {"next": null}
}

// Node account inspired from https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.3

export const SAMPLE_NODE_ACCOUNT = {
    "account": "0.0.3",
    "alias": null,
    "auto_renew_period": 105825166,
    "balance": {"balance": 18831892607754, "timestamp": "1741801141.170140000", "tokens": []},
    "created_timestamp": "1706812520.644859497",
    "decline_reward": false,
    "deleted": false,
    "ethereum_nonce": 0,
    "evm_address": "0x0000000000000000000000000000000000000003",
    "expiry_timestamp": "1812637686.644859497",
    "key": {"_type": "ED25519", "key": "e06b22e0966108fa5d63fc6ae53f9824319b891cd4d6050dbf2b242be7e13344"},
    "max_automatic_token_associations": 0,
    "memo": "",
    "pending_reward": 0,
    "receiver_sig_required": false,
    "staked_account_id": null,
    "staked_node_id": null,
    "stake_period_start": null,
    "transactions": [],
    "links": {"next": "/api/v1/accounts/3?timestamp=lt:1741801116.340191143"}
}

//
// Contract inspired from: https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/0.0.749775
//

export const SAMPLE_CONTRACT = {
    "admin_key": {
        "_type": "ED25519",
        "key": "421050820e1485acdd59726088e0e4a2130ebbbb70009f640ad95c78dd5a7b38"
    },
    "auto_renew_account": "0.0.730632",
    "auto_renew_period": 7776000,
    "contract_id": "0.0.749775",
    "created_timestamp": "1646665755.947488266",
    "deleted": false,
    "evm_address": "0x00000000000000000000000000000000000b70cf",
    "expiration_timestamp": null,
    "file_id": "0.0.749773",
    "max_automatic_token_associations": -1,
    "memo": "Mirror Node acceptance test: 2022-03-07T15:09:15.228564328Z Create contract",
    "nonce": 1,
    "obtainer_id": null,
    "proxy_account_id": null,
    "timestamp": {
        "from": "1646665755.947488266",
        "to": null
    },
    "runtime_bytecode": "0x608060405236606d573073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef3460405160639190607f565b60405180910390a3005b600080fd5b6079816098565b82525050565b6000602082019050609260008301846072565b92915050565b600081905091905056fea2646970667358221220b94efca641a0cf62b2bd505f79fe4be165c582520bc615e5c5fa3402156eafd864736f6c63430008040033"
}

//
// Contract inspired from: https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/0.0.803295
//

export const SAMPLE_CONTRACT_DUDE = {
    "admin_key": null,
    "auto_renew_period": 7776000,
    "contract_id": "0.0.803295",
    "created_timestamp": "1648377044.798291252",
    "deleted": false,
    "evm_address": "0x00000000000000000000000000000000000c41df",
    "expiration_timestamp": "1649648001.410978000",
    "file_id": "0.0.803267",
    "memo": "",
    "obtainer_id": null,
    "proxy_account_id": null,
    "timestamp": {"from": "1648377044.798291252", "to": null},
    "bytecode": "0x30783630383036303430353236303030" // deliberately kept only the first 16 bytes of the bytecode
}

export const SAMPLE_CONTRACT_DELETED = {
    "admin_key": null,
    "auto_renew_period": 7776000,
    "contract_id": "0.0.803295",
    "created_timestamp": "1648377044.798291252",
    "deleted": true,
    "evm_address": "0x00000000000000000000000000000000000c41df",
    "expiration_timestamp": "1649648001.410978000",
    "file_id": "0.0.803267",
    "memo": "",
    "obtainer_id": null,
    "proxy_account_id": null,
    "timestamp": {"from": "1648377044.798291252", "to": null},
    "bytecode": "0x30783630383036303430353236303030" // deliberately kept only the first 16 bytes of the bytecode
}

export const SAMPLE_CONTRACT_WITH_SWARM_HASH = {
    "admin_key": null,
    "auto_renew_account": null,
    "auto_renew_period": 7776000,
    "contract_id": "0.0.141642",
    "created_timestamp": "1695205453.598008003",
    "deleted": false,
    "evm_address": "0x000000000000000000000000000000000002294a",
    "expiration_timestamp": "1702981453.598008003",
    "file_id": "0.0.141639",
    "max_automatic_token_associations": 0,
    "memo": "HelloSwarm.sol + solc 0.8.17+commit.8df45f5f",
    "nonce": 1,
    "obtainer_id": null,
    "permanent_removal": null,
    "proxy_account_id": null,
    "timestamp": {"from": "1695205453.598008003", "to": null},
    "bytecode": "0x60806040523480156200001157600080fd5b5060405162000bed38038062000bed8339818101604052810190620000379190620001e3565b80600090816200004891906200047f565b505062000566565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000b9826200006e565b810181811067ffffffffffffffff82111715620000db57620000da6200007f565b5b80604052505050565b6000620000f062000050565b9050620000fe8282620000ae565b919050565b600067ffffffffffffffff8211156200012157620001206200007f565b5b6200012c826200006e565b9050602081019050919050565b60005b83811015620001595780820151818401526020810190506200013c565b60008484015250505050565b60006200017c620001768462000103565b620000e4565b9050828152602081018484840111156200019b576200019a62000069565b5b620001a884828562000139565b509392505050565b600082601f830112620001c857620001c762000064565b5b8151620001da84826020860162000165565b91505092915050565b600060208284031215620001fc57620001fb6200005a565b5b600082015167ffffffffffffffff8111156200021d576200021c6200005f565b5b6200022b84828501620001b0565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028757607f821691505b6020821081036200029d576200029c6200023f565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003077fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002c8565b620003138683620002c8565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003606200035a62000354846200032b565b62000335565b6200032b565b9050919050565b6000819050919050565b6200037c836200033f565b620003946200038b8262000367565b848454620002d5565b825550505050565b600090565b620003ab6200039c565b620003b881848462000371565b505050565b5b81811015620003e057620003d4600082620003a1565b600181019050620003be565b5050565b601f8211156200042f57620003f981620002a3565b6200040484620002b8565b8101602085101562000414578190505b6200042c6200042385620002b8565b830182620003bd565b50505b505050565b600082821c905092915050565b6000620004546000198460080262000434565b1980831691505092915050565b60006200046f838362000441565b9150826002028217905092915050565b6200048a8262000234565b67ffffffffffffffff811115620004a657620004a56200007f565b5b620004b282546200026e565b620004bf828285620003e4565b600060209050601f831160018114620004f75760008415620004e2578287015190505b620004ee858262000461565b8655506200055e565b601f1984166200050786620002a3565b60005b8281101562000531578489015182556001820191506020850194506020810190506200050a565b868310156200055157848901516200054d601f89168262000441565b8355505b6001600288020188555050505b505050505050565b61067780620005766000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633d7403a31461003b578063e21f37ce14610057575b600080fd5b61005560048036038101906100509190610270565b610075565b005b61005f610088565b60405161006c9190610338565b60405180910390f35b80600090816100849190610570565b5050565b6000805461009590610389565b80601f01602080910402602001604051908101604052809291908181526020018280546100c190610389565b801561010e5780601f106100e35761010080835404028352916020019161010e565b820191906000526020600020905b8154815290600101906020018083116100f157829003601f168201915b505050505081565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61017d82610134565b810181811067ffffffffffffffff8211171561019c5761019b610145565b5b80604052505050565b60006101af610116565b90506101bb8282610174565b919050565b600067ffffffffffffffff8211156101db576101da610145565b5b6101e482610134565b9050602081019050919050565b82818337600083830152505050565b600061021361020e846101c0565b6101a5565b90508281526020810184848401111561022f5761022e61012f565b5b61023a8482856101f1565b509392505050565b600082601f8301126102575761025661012a565b5b8135610267848260208601610200565b91505092915050565b60006020828403121561028657610285610120565b5b600082013567ffffffffffffffff8111156102a4576102a3610125565b5b6102b084828501610242565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156102f35780820151818401526020810190506102d8565b60008484015250505050565b600061030a826102b9565b61031481856102c4565b93506103248185602086016102d5565b61032d81610134565b840191505092915050565b6000602082019050818103600083015261035281846102ff565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806103a157607f821691505b6020821081036103b4576103b361035a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261041c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826103df565b61042686836103df565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061046d6104686104638461043e565b610448565b61043e565b9050919050565b6000819050919050565b61048783610452565b61049b61049382610474565b8484546103ec565b825550505050565b600090565b6104b06104a3565b6104bb81848461047e565b505050565b5b818110156104df576104d46000826104a8565b6001810190506104c1565b5050565b601f821115610524576104f5816103ba565b6104fe846103cf565b8101602085101561050d578190505b610521610519856103cf565b8301826104c0565b50505b505050565b600082821c905092915050565b600061054760001984600802610529565b1980831691505092915050565b60006105608383610536565b9150826002028217905092915050565b610579826102b9565b67ffffffffffffffff81111561059257610591610145565b5b61059c8254610389565b6105a78282856104e3565b600060209050601f8311600181146105da57600084156105c8578287015190505b6105d28582610554565b86555061063a565b601f1984166105e8866103ba565b60005b82811015610610578489015182556001820191506020850194506020810190506105eb565b8683101561062d5784890151610629601f891682610536565b8355505b6001600288020188555050505b50505050505056fea265627a7a7231582025b12311dff4c2d38251fa91e465b5df31fca9f6c32e034ba551935d652b757a64736f6c63430008110032",
    "runtime_bytecode": "0x608060405234801561001057600080fd5b50600436106100365760003560e01c80633d7403a31461003b578063e21f37ce14610057575b600080fd5b61005560048036038101906100509190610270565b610075565b005b61005f610088565b60405161006c9190610338565b60405180910390f35b80600090816100849190610570565b5050565b6000805461009590610389565b80601f01602080910402602001604051908101604052809291908181526020018280546100c190610389565b801561010e5780601f106100e35761010080835404028352916020019161010e565b820191906000526020600020905b8154815290600101906020018083116100f157829003601f168201915b505050505081565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61017d82610134565b810181811067ffffffffffffffff8211171561019c5761019b610145565b5b80604052505050565b60006101af610116565b90506101bb8282610174565b919050565b600067ffffffffffffffff8211156101db576101da610145565b5b6101e482610134565b9050602081019050919050565b82818337600083830152505050565b600061021361020e846101c0565b6101a5565b90508281526020810184848401111561022f5761022e61012f565b5b61023a8482856101f1565b509392505050565b600082601f8301126102575761025661012a565b5b8135610267848260208601610200565b91505092915050565b60006020828403121561028657610285610120565b5b600082013567ffffffffffffffff8111156102a4576102a3610125565b5b6102b084828501610242565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156102f35780820151818401526020810190506102d8565b60008484015250505050565b600061030a826102b9565b61031481856102c4565b93506103248185602086016102d5565b61032d81610134565b840191505092915050565b6000602082019050818103600083015261035281846102ff565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806103a157607f821691505b6020821081036103b4576103b361035a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261041c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826103df565b61042686836103df565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061046d6104686104638461043e565b610448565b61043e565b9050919050565b6000819050919050565b61048783610452565b61049b61049382610474565b8484546103ec565b825550505050565b600090565b6104b06104a3565b6104bb81848461047e565b505050565b5b818110156104df576104d46000826104a8565b6001810190506104c1565b5050565b601f821115610524576104f5816103ba565b6104fe846103cf565b8101602085101561050d578190505b610521610519856103cf565b8301826104c0565b50505b505050565b600082821c905092915050565b600061054760001984600802610529565b1980831691505092915050565b60006105608383610536565b9150826002028217905092915050565b610579826102b9565b67ffffffffffffffff81111561059257610591610145565b5b61059c8254610389565b6105a78282856104e3565b600060209050601f8311600181146105da57600084156105c8578287015190505b6105d28582610554565b86555061063a565b601f1984166105e8866103ba565b60005b82811015610610578489015182556001820191506020850194506020810190506105eb565b8683101561062d5784890151610629601f891682610536565b8355505b6001600288020188555050505b50505050505056fea265627a7a7231582025b12311dff4c2d38251fa91e465b5df31fca9f6c32e034ba551935d652b757a64736f6c63430008110032"
}

export const SAMPLE_CONTRACTS = {
    "contracts": [
        SAMPLE_CONTRACT
    ]
}

export const SAMPLE_CONTRACT_AS_ACCOUNT = {
    "account": "0.0.749775",
    "alias": "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ",
    "auto_renew_period": 7890000,
    "balance": {
        "balance": 200000000,
        "timestamp": "1646734500.576308000",
        "tokens": []
    },
    "deleted": false,
    "expiry_timestamp": null,
    "evm_address": "0x00000000000000000000000000000000000b70cf",
    "key": {
        "_type": "ED25519",
        "key": "f6628ec23113678f60cb6e7e3972ac0bfdec0c43c787c25fd626a05627700ba5"
    },
    "max_automatic_token_associations": null,
    "memo": "",
    "receiver_sig_required": null,
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 75871170,
            "consensus_timestamp": "1645373467.889797098",
            "entity_id": "0.0.200611",
            "max_fee": "200000000",
            "memo_base64": "c21hcnRDb250cmFjdEZ1bmN0aW9uRXhlY3V0ZTo6LXRyYW5zZmVyQW1vdW50LTo6VGFza2Jhcjo6U21hcnQgY29udHJhY3Qgc3RhdGUgY2hhbmdlIGNhbGwu",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.8",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "N174IhVVDxEtHG9iE3RKGhLgzWnKrTnPDolPjDVNLOldF3lU6IQdUVmM3zp8coQy",
            "transaction_id": "0.0.178899-1645373457-761328453",
            "transfers": [
                {
                    "account": "0.0.8",
                    "amount": 891611
                },
                {
                    "account": "0.0.98",
                    "amount": 74979559
                },
                {
                    "account": "0.0.178899",
                    "amount": -75871170
                },
                {
                    "account": "0.0.200611",
                    "amount": -100000000
                },
                {
                    "account": "0.0.689670",
                    "amount": 100000000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1645373457.761328453"
        },
        {
            "bytes": null,
            "charged_tx_fee": 18787079,
            "consensus_timestamp": "1645373400.586655580",
            "entity_id": "0.0.200611",
            "max_fee": "200000000",
            "memo_base64": "c21hcnRDb250cmFjdEZ1bmN0aW9uRXhlY3V0ZTo6LWFkZEhiYXJzLTo6VGFza2Jhcjo6IEFkZGluZyBhbW91bnQgdG8gdGFzayBzbWFydC1jb250cmFjdA==",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.5",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "H9P5awEyK5ApqNxwMVwQBUzshRJfIwWPVj/QPl5qL3qrqTTSzPIHqI/+A202qhpg",
            "transaction_id": "0.0.178899-1645373391-947654307",
            "transfers": [
                {
                    "account": "0.0.5", "amount": 885182
                },
                {
                    "account": "0.0.98",
                    "amount": 17901897
                },
                {
                    "account": "0.0.178899",
                    "amount": -118787079
                },
                {
                    "account": "0.0.200611",
                    "amount": 100000000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1645373391.947654307"
        }
    ],
}

export const SAMPLE_CONTRACT_DUDE_AS_ACCOUNT = {
    "account": "0.0.803295",
    "alias": "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ",
    "auto_renew_period": 7890000,
    "balance": {
        "balance": 200000000,
        "timestamp": "1646734500.576308000",
        "tokens": []
    },
    "deleted": false,
    "expiry_timestamp": null,
    "evm_address": "0x00000000000000000000000000000000000b70cf",
    "key": {
        "_type": "ED25519",
        "key": "f6628ec23113678f60cb6e7e3972ac0bfdec0c43c787c25fd626a05627700ba5"
    },
    "max_automatic_token_associations": null,
    "memo": "",
    "receiver_sig_required": null,
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 75871170,
            "consensus_timestamp": "1645373467.889797098",
            "entity_id": "0.0.200611",
            "max_fee": "200000000",
            "memo_base64": "c21hcnRDb250cmFjdEZ1bmN0aW9uRXhlY3V0ZTo6LXRyYW5zZmVyQW1vdW50LTo6VGFza2Jhcjo6U21hcnQgY29udHJhY3Qgc3RhdGUgY2hhbmdlIGNhbGwu",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.8",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "N174IhVVDxEtHG9iE3RKGhLgzWnKrTnPDolPjDVNLOldF3lU6IQdUVmM3zp8coQy",
            "transaction_id": "0.0.178899-1645373457-761328453",
            "transfers": [
                {
                    "account": "0.0.8",
                    "amount": 891611
                },
                {
                    "account": "0.0.98",
                    "amount": 74979559
                },
                {
                    "account": "0.0.178899",
                    "amount": -75871170
                },
                {
                    "account": "0.0.200611",
                    "amount": -100000000
                },
                {
                    "account": "0.0.689670",
                    "amount": 100000000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1645373457.761328453"
        },
        {
            "bytes": null,
            "charged_tx_fee": 18787079,
            "consensus_timestamp": "1645373400.586655580",
            "entity_id": "0.0.200611",
            "max_fee": "200000000",
            "memo_base64": "c21hcnRDb250cmFjdEZ1bmN0aW9uRXhlY3V0ZTo6LWFkZEhiYXJzLTo6VGFza2Jhcjo6IEFkZGluZyBhbW91bnQgdG8gdGFzayBzbWFydC1jb250cmFjdA==",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.5",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "H9P5awEyK5ApqNxwMVwQBUzshRJfIwWPVj/QPl5qL3qrqTTSzPIHqI/+A202qhpg",
            "transaction_id": "0.0.178899-1645373391-947654307",
            "transfers": [
                {
                    "account": "0.0.5", "amount": 885182
                },
                {
                    "account": "0.0.98",
                    "amount": 17901897
                },
                {
                    "account": "0.0.178899",
                    "amount": -118787079
                },
                {
                    "account": "0.0.200611",
                    "amount": 100000000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1645373391.947654307"
        }
    ],
}

export const SAMPLE_CONTRACT_DELETED_AS_ACCOUNT = {
    "account": "0.0.803295",
    "alias": "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ",
    "auto_renew_period": 7890000,
    "balance": {
        "balance": 200000000,
        "timestamp": "1646734500.576308000",
        "tokens": []
    },
    "deleted": false,
    "expiry_timestamp": null,
    "evm_address": "0x00000000000000000000000000000000000b70cf",
    "key": {
        "_type": "ED25519",
        "key": "f6628ec23113678f60cb6e7e3972ac0bfdec0c43c787c25fd626a05627700ba5"
    },
    "max_automatic_token_associations": null,
    "memo": "",
    "receiver_sig_required": null,
    "transactions": [
        {
            "bytes": null,
            "charged_tx_fee": 75871170,
            "consensus_timestamp": "1645373467.889797098",
            "entity_id": "0.0.200611",
            "max_fee": "200000000",
            "memo_base64": "c21hcnRDb250cmFjdEZ1bmN0aW9uRXhlY3V0ZTo6LXRyYW5zZmVyQW1vdW50LTo6VGFza2Jhcjo6U21hcnQgY29udHJhY3Qgc3RhdGUgY2hhbmdlIGNhbGwu",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.8",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "N174IhVVDxEtHG9iE3RKGhLgzWnKrTnPDolPjDVNLOldF3lU6IQdUVmM3zp8coQy",
            "transaction_id": "0.0.178899-1645373457-761328453",
            "transfers": [
                {
                    "account": "0.0.8",
                    "amount": 891611
                },
                {
                    "account": "0.0.98",
                    "amount": 74979559
                },
                {
                    "account": "0.0.178899",
                    "amount": -75871170
                },
                {
                    "account": "0.0.200611",
                    "amount": -100000000
                },
                {
                    "account": "0.0.689670",
                    "amount": 100000000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1645373457.761328453"
        },
        {
            "bytes": null,
            "charged_tx_fee": 18787079,
            "consensus_timestamp": "1645373400.586655580",
            "entity_id": "0.0.200611",
            "max_fee": "200000000",
            "memo_base64": "c21hcnRDb250cmFjdEZ1bmN0aW9uRXhlY3V0ZTo6LWFkZEhiYXJzLTo6VGFza2Jhcjo6IEFkZGluZyBhbW91bnQgdG8gdGFzayBzbWFydC1jb250cmFjdA==",
            "name": "CONTRACTCALL",
            "nft_transfers": [],
            "node": "0.0.5",
            "nonce": 0,
            "parent_consensus_timestamp": null,
            "result": "SUCCESS",
            "scheduled": false,
            "staking_reward_transfers": [],
            "token_transfers": [],
            "transaction_hash": "H9P5awEyK5ApqNxwMVwQBUzshRJfIwWPVj/QPl5qL3qrqTTSzPIHqI/+A202qhpg",
            "transaction_id": "0.0.178899-1645373391-947654307",
            "transfers": [
                {
                    "account": "0.0.5", "amount": 885182
                },
                {
                    "account": "0.0.98",
                    "amount": 17901897
                },
                {
                    "account": "0.0.178899",
                    "amount": -118787079
                },
                {
                    "account": "0.0.200611",
                    "amount": 100000000
                }
            ],
            "valid_duration_seconds": "120",
            "valid_start_timestamp": "1645373391.947654307"
        }
    ],
}

export const SAMPLE_CONTRACT_ACTIONS = {
    "actions": [
        {
            "call_depth": 0,
            "call_operation_type": "CALL",
            "call_type": "CALL",
            "caller": "0.0.88037",
            "caller_type": "ACCOUNT",
            "from": "0x00000000000000000000000000000000000157e5",
            "gas": 15000,
            "gas_used": 13279,
            "index": 0,
            "input": "0xb01ef608",
            "recipient": "0.0.96039",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x0000000000000000000000000000000000017727",
            "value": 0
        },
        {
            "call_depth": 1,
            "call_operation_type": "DELEGATECALL",
            "call_type": "CALL",
            "caller": "0.0.96039",
            "caller_type": "CONTRACT",
            "from": "0x0000000000000000000000000000000000017727",
            "gas": 9924,
            "gas_used": 8319,
            "index": 1,
            "input": "0x70a082310000000000000000000000008529228f3391cf8d79a0286050cc066a1d5235fb",
            "recipient": "0.0.96037",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x0000000000000000000000000000000000017725",
            "value": 0
        },
        {
            "call_depth": 2,
            "call_operation_type": "STATICCALL",
            "call_type": "CALL",
            "caller": "0.0.96037",
            "caller_type": "CONTRACT",
            "from": "0x0000000000000000000000000000000000017725",
            "gas": 4516,
            "gas_used": 2751,
            "index": 2,
            "input": "0x70a082310000000000000000000000008529228f3391cf8d79a0286050cc066a1d5235fb",
            "recipient": "0.0.96042",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x000000000000000000000000000000000001772a",
            "value": 0
        },
        {
            "call_depth": 2,
            "call_operation_type": "STATICCALL",
            "call_type": "SYSTEM",
            "caller": "0.0.96037",
            "caller_type": "CONTRACT",
            "from": "0x0000000000000000000000000000000000017725",
            "gas": 4516,
            "gas_used": 2751,
            "index": 3,
            "input": "0x49146bde000000000000000000000000845b706151aed537b1fd81c1ea4ea03920097abd0000000000000000000000000000000000000000000000000000000002e6ae09",
            "recipient": "0.0.359",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x0000000000000000000000000000000000000167",
            "value": 0
        },
        {
            "call_depth": 1,
            "call_operation_type": "DELEGATECALL",
            "call_type": "CALL",
            "caller": "0.0.96039",
            "caller_type": "CONTRACT",
            "from": "0x0000000000000000000000000000000000017727",
            "gas": 9924,
            "gas_used": 8319,
            "index": 4,
            "input": "0x70a082310000000000000000000000008529228f3391cf8d79a0286050cc066a1d5235fb",
            "recipient": "0.0.96037",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x0000000000000000000000000000000000017725",
            "value": 0
        },
        {
            "call_depth": 1,
            "call_operation_type": "DELEGATECALL",
            "call_type": "CALL",
            "caller": "0.0.96039",
            "caller_type": "CONTRACT",
            "from": "0x0000000000000000000000000000000000017727",
            "gas": 9924,
            "gas_used": 8319,
            "index": 5,
            "input": "0x70a082310000000000000000000000008529228f3391cf8d79a0286050cc066a1d5235fb",
            "recipient": "0.0.96037",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x0000000000000000000000000000000000017725",
            "value": 0
        },
        {
            "call_depth": 2,
            "call_operation_type": "STATICCALL",
            "call_type": "CALL",
            "caller": "0.0.96037",
            "caller_type": "CONTRACT",
            "from": "0x0000000000000000000000000000000000017725",
            "gas": 4516,
            "gas_used": 2751,
            "index": 6,
            "input": "0x70a082310000000000000000000000008529228f3391cf8d79a0286050cc066a1d5235fb",
            "recipient": "0.0.96042",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x000000000000000000000000000000000001772a",
            "value": 0
        },
        {
            "call_depth": 3,
            "call_operation_type": "DELEGATECALL",
            "call_type": "SYSTEM",
            "caller": "0.0.96042",
            "caller_type": "CONTRACT",
            "from": "0x000000000000000000000000000000000001772a",
            "gas": 1787,
            "gas_used": 2,
            "index": 7,
            "input": "0x618dc65e000000000000000000000000000000000001772a70a082310000000000000000000000008529228f3391cf8d79a0286050cc066a1d5235fb",
            "recipient": "0.0.359",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x0000000000000000000000000000000000000167",
            "value": 0
        },
        {
            "call_depth": 1,
            "call_operation_type": "DELEGATECALL",
            "call_type": "CALL",
            "caller": "0.0.96039",
            "caller_type": "CONTRACT",
            "from": "0x0000000000000000000000000000000000017727",
            "gas": 9924,
            "gas_used": 8319,
            "index": 8,
            "input": "0x70a082310000000000000000000000008529228f3391cf8d79a0286050cc066a1d5235fb",
            "recipient": "0.0.96037",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000005a995c0",
            "result_data_type": "OUTPUT",
            "timestamp": "1665660662.058072633",
            "to": "0x0000000000000000000000000000000000017725",
            "value": 0
        },
    ],
    "links": {
        "next": null
    }
}

export const SAMPLE_TOPIC = {
    "admin_key": {
        "_type": "ED25519",
        "key": "c249a323c878f5b5e2daccda6d731e6fdc32f870228d1cd4fae559d947dbc36c"
    },
    "auto_renew_account": "0.0.31393",
    "auto_renew_period": 8000000,
    "created_timestamp": "1717507875.076772003",
    "deleted": false,
    "memo": "Mirror Node acceptance test: 2024-06-04T13:31:14.587755893Z Create Topic",
    "submit_key": {"_type": "ED25519", "key": "8ebc7a7fa141bae14ce76669f6f91d533f3365d6a9a465741f7e6e4abbf7aaf3"},
    "timestamp": {"from": "1717507965.841820555", "to": null},
    "topic_id": "0.0.31407"
}

export const SAMPLE_DELETED_TOPIC = {
    "admin_key": {
        "_type": "ED25519",
        "key": "c249a323c878f5b5e2daccda6d731e6fdc32f870228d1cd4fae559d947dbc36c"
    },
    "auto_renew_account": "0.0.31393",
    "auto_renew_period": 8000000,
    "created_timestamp": "1717507875.076772003",
    "deleted": true,
    "memo": "Mirror Node acceptance test: 2024-06-04T13:31:14.587755893Z Create Topic",
    "submit_key": {"_type": "ED25519", "key": "8ebc7a7fa141bae14ce76669f6f91d533f3365d6a9a465741f7e6e4abbf7aaf3"},
    "timestamp": {"from": "1717507965.841820555", "to": null},
    "topic_id": "0.0.31407"
}

//
// https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.5707211
//

export const SAMPLE_TOPIC_WITH_CUSTOM_FEES = {
    "admin_key": {"_type": "ED25519", "key": "a517d32585344b4f97429b71ced2b1a80991fb2a2b7afa6878adb04000909c54"},
    "auto_renew_account": "0.0.4736212",
    "auto_renew_period": 7776000,
    "created_timestamp": "1741758402.192668771",
    "custom_fees": {
        "created_timestamp": "1741758408.472996923",
        "fixed_fees": [
            {
                "amount": 3,
                "collector_account_id": "0.0.4736212",
                "denominating_token_id": "0.0.5707212"
            },
            {
                "amount": 4,
                "collector_account_id": "0.0.4736212",
                "denominating_token_id": "0.0.5707213"
            }
        ]
    },
    "deleted": false,
    "fee_exempt_key_list": [
        {
            "_type": "ECDSA_SECP256K1",
            "key": "022759f5dcaba76d2c6cad9766643fd9bb3fce2ae6eda25afdae8bbef5badb4e95"
        },
        {
            "_type": "ECDSA_SECP256K1", "key": "03b6902642e758d03e35f1b9aff9048ee0448476d134478d3f02be35a6c639b3ed"
        }
    ],
    "fee_schedule_key": {
        "_type": "ECDSA_SECP256K1",
        "key": "021ef47310b559d5b6502239e021acc618a55f96f03b6664eb22e36583e4063a7d"
    },
    "memo": "",
    "submit_key": {"_type": "ED25519", "key": "a517d32585344b4f97429b71ced2b1a80991fb2a2b7afa6878adb04000909c54"},
    "timestamp": {"from": "1741758408.472996923", "to": null},
    "topic_id": "0.0.5707211"
}

//
// https://mainnet-public.mirrornode.hedera.com/api/v1/topics/0.0.642394/messages
//

export const SAMPLE_TOPIC_MESSAGES = {
    "messages": [
        {
            "chunk_info": null,
            "consensus_timestamp": "1642097190.065332012",
            "message": "YmFja2dyb3VuZE1lc3NhZ2U=",
            "payer_account_id": "0.0.950",
            "running_hash": "Qbj2w8zTxPQfB52pbwP/Quba5azJqmi0n0PvCaYL5+m3ytQuVoMREbYyjPYqnTS+",
            "running_hash_version": 3,
            "sequence_number": 6,
            "topic_id": "0.0.642394"
        },
        {
            "chunk_info": null,
            "consensus_timestamp": "1642097184.056478572",
            "message": "YmFja2dyb3VuZE1lc3NhZ2U=",
            "payer_account_id": "0.0.950",
            "running_hash": "8byKHCHutoTADN1e83GtFAMek+5BffakLZUuGOre0cAt3s4yk1jnxLvWsttLfs3n",
            "running_hash_version": 3,
            "sequence_number": 5,
            "topic_id": "0.0.642394"
        }
    ]
}

export const SAMPLE_TOPIC_DUDE_MESSAGES = {
    "messages": [{
        "chunk_info": null,
        "consensus_timestamp": "1642097145.865478140",
        "message": "AAABflSd9RZfTmV3IG1lc3NhZ2VfMQ==",
        "payer_account_id": "0.0.950",
        "running_hash": "nuY7eAuT59yV4x0YzKg38osujQL6bNvBMReh3wjBEb0mupTWK09MdZ3E31iizTB9",
        "running_hash_version": 3,
        "sequence_number": 1,
        "topic_id": "0.0.642393"
    }, {
        "chunk_info": null,
        "consensus_timestamp": "1642097150.887214000",
        "message": "AAABflSeCklfTmV3IG1lc3NhZ2VfMg==",
        "payer_account_id": "0.0.950",
        "running_hash": "Kt6tmLlY3qa3kKT3ODlnZjeIIeQkj4CcrbfBGGJBo+Gi60XJVNCPwkvgl5RZ8tF8",
        "running_hash_version": 3,
        "sequence_number": 2,
        "topic_id": "0.0.642393"
    }, {
        "chunk_info": null,
        "consensus_timestamp": "1642097156.871110000",
        "message": "YmFja2dyb3VuZE1lc3NhZ2U=",
        "payer_account_id": "0.0.950",
        "running_hash": "OZoXCNImUR6vm2LVot6EmO4TMCywXUvAl7GZ3ONpj2CmAWckrUscWWcMx6LRYsmw",
        "running_hash_version": 3,
        "sequence_number": 3,
        "topic_id": "0.0.642393"
    }]
}

//
// https://previewnet.mirrornode.hedera.com/api/v1/network/nodes
//

export const SAMPLE_NETWORK_NODES = {
    "nodes": [
        {
            "admin_key": {
                "_type": "ED25519",
                "key": "c67e3c4172e3eea8e4f45714240e453ab8702e7fc13d7ea58e523e6caeb8a38e"
            },
            "description": "Hosted by Hedera | East Coast, USA",
            "file_id": "0.0.102",
            "memo": "0.0.3",
            "node_id": 0,
            "node_account_id": "0.0.3",
            "node_cert_hash": "0xa171e3ba83476747aeb2e2ac4d0e115caaab918203b0dfe1cdeab443438fc289abc8ba8a6aff83db5f1b334046da88c8",
            "public_key": "0x308201a2300d0609",
            "reward_rate_start": 2740,
            "service_endpoints": [
                {
                    "ip_address_v4": "3.211.248.172",
                    "port": 50211
                },
                {
                    "ip_address_v4": "3.211.248.172",
                    "port": 50212
                },
                {
                    "ip_address_v4": "35.231.208.148",
                    "port": 0
                },
                {
                    "ip_address_v4": "35.231.208.148",
                    "port": 50211
                },
                {
                    "ip_address_v4": "35.231.208.148",
                    "port": 50212
                },
            ],
            "timestamp": {
                "from": "1654531806.041135961",
                "to": null
            },
            "max_stake": 3000000000000000,
            "min_stake": 100000000000000,
            "stake": 600000000000000,
            "stake_not_rewarded": 100000000000000,
            "stake_rewarded": 500000000000000,
            "staking_period": null
        },
        {
            "description": "Hosted by Hedera | East Coast, USA",
            "file_id": "0.0.102",
            "memo": "0.0.4",
            "node_id": 1,
            "node_account_id": "0.0.4",
            "node_cert_hash": "0x7409dec2e494b627ee49c69b294be1ceaebca3fdcaf36789e88fc7d5b0eef5561f52b82d35191a39c2fbed6027267166",
            "public_key": "0x308201a2300d0609",
            "reward_rate_start": 5479,
            "service_endpoints": [
                {
                    "ip_address_v4": "3.133.213.146",
                    "port": 50211
                },
                {
                    "port": 50212
                }
            ],
            "timestamp": {
                "from": "1654531806.041135961",
                "to": null
            },
            "max_stake": 3000000000000000,
            "min_stake": 100000000000000,
            "stake": 900000000000000,
            "stake_not_rewarded": 200000000000000,
            "stake_rewarded": 700000000000000,
            "staking_period": null
        },
        {
            "admin_key": {
                "_type": "ProtobufEncoded",
                "key": "2aa2040802129d040a221220d40d60cfe24c1e6e63eddbbbb857c6540759e02514b1a151d8147f07d4e3eaee0ad2032acf03080112ca030a221220775334a1a5d250c3bfc75b8b81fa2d5fc8fed7d5dab4b2a5ec272aa952aa377c0a2212205b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d10a2212203aa16f6f6cf5b95057ba1854cf5822a446d082b37212a3f1c164babadb713f870a93023290020a221220b3a3e302a74198085e0752495528a6bc475b6bc1f4ba9ae246d9235e5a45e43c0a221220b31d0cfc76ea431928330adfc3094780985876c87864bfe094f956dee4e05d9a0a221220c5b759fee0f23620330deea250bd1a66602f8d847bc181482e268d63e16ae16a0aa101329e010a9b013298010a722a700801126c0a221220b5d243760381ec28f8df73ca2707761720482612071fead9a8a14ff1e0c2f36a0a2212202f170df8b57ee630c42e408a6fc749e4ee62174fce66b9e03c9d9b4e68d35d400a221220bce139f0d9e6d69076f8915fcc32209ade6debaca3f05ee5a713e652b65e73290a221220a4c8bfd29c164be686c18d9ddbb09c3a47a375a57f32f6df6aec9ccef80f817c0a221220c5040cb52c20d2ab9496893fca0b690cb13855e6e55231e63360c3976e64a25c0a22122078b769551a81d0fd10c3b5390abb3de92ed4878977a119c2be2039247d8182da0a2212205b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d1"
            },
            "description": "Hosted by Hedera | Central, USA",
            "file_id": "0.0.102",
            "memo": "0.0.5",
            "node_id": 2,
            "node_account_id": "0.0.5",
            "node_cert_hash": "0x9b1416584a4a380bb86a6c7d7207d8aeddbc3b63ea305998255bce8351ba4b5dca52c9282a54a6bed60de63ce03aaa24",
            "public_key": "0x308201a2300d0609",
            "reward_rate_start": 8219,
            "service_endpoints": [
                {
                    "ip_address_v4": "3.133.213.146",
                    "port": 50211
                },
                {
                    "ip_address_v4": "3.133.213.147"
                }
            ],
            "timestamp": {
                "from": "1654531806.041135961",
                "to": null
            },
            "max_stake": 3000000000000000,
            "min_stake": 100000000000000,
            "stake": 900000000000000,
            "stake_not_rewarded": 200000000000000,
            "stake_rewarded": 700000000000000,
            "staking_period": null
        }
    ],
}

//
// https://testnet.mirrornode.hedera.com/api/v1/network/stake
//

export const SAMPLE_NETWORK_STAKE = {
    "max_staking_reward_rate_per_hbar": 0,
    "node_reward_fee_fraction": 0,
    "stake_total": 2400000000000000,
    "staking_period": {
        "from": "1661212800.000000000",
        "to": "1661299200.000000000"
    },
    "staking_period_duration": 0,
    "staking_periods_stored": 0,
    "staking_reward_fee_fraction": 0,
    "staking_reward_rate": 0,
    "staking_start_threshold": 0
}

//
// https://mainnet-public.mirrornode.hedera.com/api/v1/network/supply
//

export const SAMPLE_NETWORK_SUPPLY = {
    "released_supply": "2108462088443004452",
    "timestamp": "1654245000.545436000",
    "total_supply": "5000000000000000000"
}

//
// https://mainnet-public.mirrornode.hedera.com/api/v1/network/exchangerate
//

export const SAMPLE_NETWORK_EXCHANGERATE = {
    "current_rate": {
        "cent_equivalent": 738099,
        "expiration_time": 1668679200,
        "hbar_equivalent": 30000
    },
    "next_rate": {
        "cent_equivalent": 739000,
        "expiration_time": 1668682800,
        "hbar_equivalent": 30000
    },
    "timestamp": "1668675657.744650810"
}

//
// https://testnet.mirrornode.hedera.com/api/v1/blocks?timestamp=gte:1662111646.528325857&limit=2
//

export const SAMPLE_BLOCKSRESPONSE = {
    "blocks": [
        {
            "count": 3,
            "hapi_version": "0.29.1",
            "hash": "0xe9630d7d8cc86d0e0d3de5316995bbdf9f2a584524cf18da233abdcff82df97da0a0ec38c6b4046101294896ff88a86b",
            "name": "2022-09-23T06_58_31.328130742Z.rcd.gz",
            "number": 25175998,
            "previous_hash": "0x7ece042fa9369ac7d6a407ffd4d4b76b284b54077abf2f5212e969a9fcbe34676f9eaae9dc718e8ca9987a48f92aa7c6",
            "size": 663,
            "timestamp": {"from": "1663916311.328130742", "to": "1663916311.328130742"},
            "gas_used": 0,
            "logs_bloom": "0x"
        },
        {
            "count": 5,
            "hapi_version": "0.29.1",
            "hash": "0x7ece042fa9369ac7d6a407ffd4d4b76b284b54077abf2f5212e969a9fcbe34676f9eaae9dc718e8ca9987a48f92aa7c6",
            "name": "2022-09-23T06_58_28.211469425Z.rcd.gz",
            "number": 25175997,
            "previous_hash": "0x6128cfb804b9552cac0ddd98b847cbc8a5ef8f206cfcd0d191acca6eebe464b4be4713af794728cbfa20afe1b808bbfb",
            "size": 2014,
            "timestamp": {"from": "1663916308.211469425", "to": "1663916309.239784003"},
            "gas_used": 0,
            "logs_bloom": "0x"
        }
    ], "links": {"next": "/api/v1/blocks?timestamp=gte:1662111646.528325857&limit=2&block.number=lt:25175997"}
}

export const SAMPLE_BLOCK = SAMPLE_BLOCKSRESPONSE.blocks[0]

export const SAMPLE_BLOCK_ZERO = {
    "count": 706,
    "hapi_version": "0.43.0",
    "hash": "0xaf24e166724841d838a23ef39040e94309cadb415ffbf1eaa9ce84c14ba1396a550de0a25dfe44f7b6a4a22782f8a06c",
    "name": "2023-09-21T18_00_12.768624298Z.rcd.gz",
    "number": 0,
    "previous_hash": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "size": 45836,
    "timestamp": {"from": "1695319212.768624298", "to": "1695319212.768625003"},
    "gas_used": 0,
    "logs_bloom": "0x"
}

//
// Contract state
//

export const SAMPLE_LOGIC_ADDRESS_RESPONSE: ContractStateResponse = {
    state: [
        {
            "address": SAMPLE_CONTRACT.evm_address,
            "contract_id": SAMPLE_CONTRACT.contract_id,
            "timestamp": "1706044673.266736003",
            "slot": "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103",
            "value": "0x00000000000000000000000000000000000000000000000000000000000c41df" // SAMPLE_CONTRACT_DUDE
        }
    ],
    links: {next: null}
}

export const SAMPLE_ADMIN_ADDRESS_RESPONSE: ContractStateResponse = {
    state: [
        {
            "address": SAMPLE_CONTRACT.evm_address,
            "contract_id": SAMPLE_CONTRACT.contract_id,
            "timestamp": "1706044673.266736003",
            "slot": "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
            "value": "0x000000000000000000000000000000000000000000000000000000000002294a" // SAMPLE_CONTRACT_WITH_SWARM_HASH
        }
    ],
    links: {next: null}
}

//
// https://www.4byte.directory/api/v1/signatures/?hex_signature=0xb01ef608
//

export const SAMPLE_4BYTE_0xB01EF608 = {

    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 842814,
            "created_at": "2022-07-03T20:24:54.756716Z",
            "text_signature": "buyV2(address,uint256,uint256,address)",
            "hex_signature": "0xb01ef608",
            "bytes_signature": "°\u001eö\b"
        },
    ]

}
