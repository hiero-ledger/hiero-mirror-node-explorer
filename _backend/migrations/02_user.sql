-- SPDX-License-Identifier: Apache-2.0

CREATE TYPE user_role AS ENUM (
    'developer',
    'partner',
    'council_member'
);

CREATE TABLE "user"
(
    user_id           uuid PRIMARY KEY                          DEFAULT uuid_generate_v1mc(),

    created_at        timestamptz                   NOT NULL    DEFAULT now(),
    updated_at        timestamptz,
    last_login_at     timestamptz,
    last_seen_at      timestamptz,

    email             text COLLATE case_insensitive NOT NULL    UNIQUE,

    password_hash     text                          NOT NULL,
    verification_code char(8)                       NOT NULL,
    email_verified_at timestamptz,                  -- NULL <=> unverified


    first_name             text                     NOT NULL    DEFAULT ''   CHECK ( char_length(first_name) <= 64 ),
    last_name              text                     NOT NULL    DEFAULT ''   CHECK ( char_length(last_name) <= 64 ),
    "role"                 user_role
);

SELECT trigger_updated_at('"user"');
