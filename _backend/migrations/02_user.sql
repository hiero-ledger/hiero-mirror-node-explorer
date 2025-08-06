-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE "user"
(
    user_id           uuid PRIMARY KEY                          DEFAULT uuid_generate_v1mc(),

    created_at        timestamptz                   NOT NULL    DEFAULT now(),
    updated_at        timestamptz,
    last_login_at     timestamptz,
    last_seen_at      timestamptz,

    email             text COLLATE case_insensitive NOT NULL    UNIQUE,

    password_hash     text                          NOT NULL,
    verification_code text                          NOT NULL,
    email_verified_at timestamptz                   -- NULL <=> unverified
);

SELECT trigger_updated_at('"user"');
