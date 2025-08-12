// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {afterEach, beforeEach, describe, it} from "node:test"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"
import { AppModule } from "../src/app/app.module"
import { SignUpBody } from "../../_common/auth/SignUpBody"
import {AppController} from "../src/app/app.controller";

describe("AuthController (e2e)", () => {
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

  it("/signUp (POST) - bad request", async () => {
    await request(app.getHttpServer())
      .post("/auth/signUp")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send({})
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send("dummy request body")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send({ "email": "wrong-email", "password": "secret" })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send({ "email": "alice@example.com", "password": "" })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("/signUp (POST)", async () => {
    const signUpBody: SignUpBody = {
      email: "alice@example.com",
      password: "secret",
    }
    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send(signUpBody)
      .expect(HttpStatus.CONFLICT)
  })

})
