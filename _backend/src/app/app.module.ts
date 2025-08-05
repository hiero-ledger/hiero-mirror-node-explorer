// SPDX-License-Identifier: Apache-2.0

import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import { PgModule } from "../pg/pg.module"

@Module({
  imports: [ConfigModule.forRoot(), PgModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
