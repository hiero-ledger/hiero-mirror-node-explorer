-- SPDX-License-Identifier: Apache-2.0

CREATE TYPE entity_type AS ENUM ('account', 'contract', 'token', 'topic', 'schedule');

CREATE TABLE entity_label
(
    user_id         uuid        NOT NULL REFERENCES "user" ON DELETE CASCADE,

    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz,

    shard           bigint      NOT NULL,
    realm           bigint      NOT NULL,
    num             bigint      NOT NULL,
    entity_type     entity_type NOT NULL,
    public_key_der  bytea CHECK ( octet_length(public_key_der) <= 50),

    name            varchar(35),
    label_type      varchar(35),
    website         varchar(2000),
    description     varchar(5000),

    network_name    varchar(64), -- same as name field in networks-config.json
    network_genesis varchar(30), -- timestamp of network block #0 (to detect network reset)

    PRIMARY KEY (user_id, network_name, shard, realm, num)
);

SELECT trigger_updated_at('entity_label');

CREATE INDEX idx_entity_label_user_id_network ON entity_label (user_id, network_name);

