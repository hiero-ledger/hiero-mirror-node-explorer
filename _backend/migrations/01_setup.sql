-- provides uuid_generate_v1mc
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- text collation that sorts text case-insensitively, useful for `UNIQUE` indexes
create collation case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);

