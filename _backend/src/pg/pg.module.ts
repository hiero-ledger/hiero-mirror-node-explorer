// SPDX-License-Identifier: Apache-2.0

import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import pg from "pg"
import { PG_OPTIONS, PG_POOL } from "./pg.constants"
import { migrate } from "postgres-migrations"

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_OPTIONS,
      inject: [ConfigService],
      useFactory: (config: ConfigService): pg.PoolConfig => {
        return {
          host: config.get<string>("PG_HOST", "localhost"),
          port: config.get<number>("PG_PORT", 5432),
          user: config.get<string>("PG_USER", "postgres"),
          password: config.get<string>("PG_PASSWORD"),
          database: config.get<string>("PG_DATABASE"),
          // Setup from Hedera Portal
          max: 75,
          min: 1,
          maxUses: 7500,
          connectionTimeoutMillis: 2000,
          idleTimeoutMillis: 10_000,
        }
      },
    },
    {
      provide: PG_POOL,
      inject: [PG_OPTIONS],
      useFactory: async (poolConfig: pg.PoolConfig): Promise<pg.Pool> => {
        const result = new pg.Pool(poolConfig)
        await migrate({ client: result }, "./migrations")
        return Promise.resolve(result)
      },
    },
  ],
  exports: [PG_POOL],
})
export class PgModule {}
