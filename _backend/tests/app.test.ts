// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import { afterEach, beforeEach, describe, it } from "node:test"
import { Test, TestingModule } from "@nestjs/testing"
import { HttpStatus, INestApplication } from "@nestjs/common"
import request from "supertest"
import { App } from "supertest/types"
import { AppModule } from "../src/app/app.module"
import { AppController } from "../src/app/app.controller"
import { ConfigModule } from "@nestjs/config"
import { mainConfig } from "../src/main.config"

describe("AppController (e2e)", () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forFeature(async () => ({
          JWT_SECRET_KEY: "not-very-secret",
        })),
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    mainConfig(app)
    await app.init()
  })

  afterEach(async () => {
    const controller = app.get<AppController>(AppController)
    await controller.end()
  })

  it("/api/v1 (GET)", async () => {
    await request(app.getHttpServer())
      .get("/api/v1")
      .expect(HttpStatus.UNAUTHORIZED)
  })
})
