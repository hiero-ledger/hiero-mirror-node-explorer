// SPDX-License-Identifier: Apache-2.0

import { Module } from "@nestjs/common"
import { PgModule } from "../pg/pg.module"
import { UserService } from "./user.service"

@Module({
  imports: [PgModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
