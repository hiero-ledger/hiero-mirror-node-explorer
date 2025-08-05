// SPDX-License-Identifier: Apache-2.0

import { beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { Test, TestingModule } from "@nestjs/testing"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { PgModule } from "../pg/pg.module"

describe("AppController", () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [PgModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe("root", () => {
    it('should return "Hello World!"', async () => {
      assert.match(await appController.getHello(), /PostgreSQL/)
    })
  })
})
