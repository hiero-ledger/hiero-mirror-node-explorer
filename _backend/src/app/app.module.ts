// SPDX-License-Identifier: Apache-2.0

import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { PgModule } from "../pg/pg.module"
import { UserModule } from "../user/user.module"

@Module({
  imports: [ConfigModule.forRoot(), PgModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
