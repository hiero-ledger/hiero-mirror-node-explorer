// SPDX-License-Identifier: Apache-2.0

import { afterEach, beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { Test, TestingModule } from "@nestjs/testing"
import { EntityLabelController } from "./entity-label.controller"
import { PgModule } from "../pg/pg.module"
import { EntityLabelService } from "./entity-label.service"

describe("EntityLabelController", () => {
  let controller: EntityLabelController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PgModule],
      controllers: [EntityLabelController],
      providers: [EntityLabelService],
    }).compile()

    controller = module.get<EntityLabelController>(EntityLabelController)
  })

  afterEach(async () => {
    await controller.end()
  })

  it("should be defined", () => {
    assert.notEqual(controller, undefined)
  })
})
