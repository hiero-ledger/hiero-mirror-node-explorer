// SPDX-License-Identifier: Apache-2.0

import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthController } from "../auth/auth.controller"
import { AuthModule } from "../auth/auth.module"
import { AuthService } from "../auth/auth.service"
import { PgModule } from "../pg/pg.module"
import { UserModule } from "../user/user.module"
import { JwtModule } from "@nestjs/jwt"
import { EntityLabelModule } from "../entity-label/entity-label.module"
import { EntityLabelController } from "../entity-label/entity-label.controller"
import { EntityLabelService } from "../entity-label/entity-label.service"

@Module({
  imports: [
    ConfigModule.forRoot(),
    PgModule,
    UserModule,
    AuthModule,
    JwtModule,
    EntityLabelModule,
  ],
  controllers: [AppController, AuthController, EntityLabelController],
  providers: [AppService, AuthService, EntityLabelService],
})
export class AppModule {}
