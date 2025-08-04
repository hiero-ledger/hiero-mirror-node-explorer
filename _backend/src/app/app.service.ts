// SPDX-License-Identifier: Apache-2.0

import {Inject, Injectable} from '@nestjs/common';
import {PG_POOL} from "../pg/pg.constants";
import pg from "pg";

@Injectable()
export class AppService {
  constructor(@Inject(PG_POOL) private readonly pgPool: pg.Pool) {}
  async getHello(): Promise<string> {
    return await this.selectVersion()
  }

  private async selectVersion(): Promise<string> {
    const text = "select version()"
    const r = await this.pgPool.query(text)
    return Promise.resolve(JSON.stringify(r.rows[0].version))
  }
}
