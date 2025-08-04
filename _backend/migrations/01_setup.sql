-- SPDX-License-Identifier: Apache-2.0

-- provides uuid_generate_v1mc
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- text collation that sorts text case-insensitively, useful for `UNIQUE` indexes
create collation case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);

-- while `created_at` can just be `default now()`, setting `updated_at` on update requires a trigger
create or replace function set_updated_at()
    returns trigger as
$$
begin
    NEW.updated_at = now();
    return NEW;
end;
$$ language plpgsql;

create or replace function trigger_updated_at(tablename regclass)
    returns void as
$$
begin
    execute format('CREATE TRIGGER set_updated_at
        BEFORE UPDATE
        ON %s
        FOR EACH ROW
        WHEN (OLD is distinct from NEW)
    EXECUTE FUNCTION set_updated_at();', tablename);
end;
$$ language plpgsql;
