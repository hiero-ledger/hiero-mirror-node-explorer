// SPDX-License-Identifier: Apache-2.0

import { Inject, Injectable } from "@nestjs/common"
import { PG_POOL } from "../pg/pg.constants"
import pg from "pg"

@Injectable()
export class UserService {
  constructor(@Inject(PG_POOL) private readonly pgPool: pg.Pool) {}

  async createEmptyUser(email: string) {
    const r = await this.pgPool.query<string[]>({
      name: "user-create-empty",
      text: `
                WITH inserted as (
                    INSERT INTO "user" (email)
                        VALUES ($1)
                        ON CONFLICT (email) DO NOTHING
                        RETURNING user_id)
                SELECT user_id
                FROM inserted
                UNION
                SELECT user_id
                FROM "user"
                WHERE email = $1
                LIMIT 1
            `,
      values: [email],
      rowMode: "array",
    })

    return r.rows[0][0]
  }
}
