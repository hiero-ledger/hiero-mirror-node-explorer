// SPDX-License-Identifier: Apache-2.0

import { Module } from "@nestjs/common"
import { EntityLabelController } from "./entity-label.controller"
import { EntityLabelService } from "./entity-label.service"
import { PgModule } from "../pg/pg.module"

@Module({
  imports: [PgModule],
  controllers: [EntityLabelController],
  providers: [EntityLabelService],
})
export class EntityLabelModule {}
