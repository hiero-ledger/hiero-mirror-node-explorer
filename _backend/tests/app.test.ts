// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {afterEach, beforeEach, describe, it} from "node:test"
import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import request from "supertest"
import { App } from "supertest/types"
import { AppModule } from "../src/app/app.module"
import {AppController} from "../src/app/app.controller";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    const controller = app.get<AppController>(AppController)
    await controller.end()
  })

  it("/ (GET)", async () => {
    await request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect(/PostgreSQL/)
  })
})
