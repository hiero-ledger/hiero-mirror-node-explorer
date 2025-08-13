// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import { afterEach, beforeEach, describe, it } from "node:test"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"
import { AppModule } from "../src/app/app.module"
import { SignUpBody } from "../../_common/auth/SignUpBody"
import { AppController } from "../src/app/app.controller"
import { UserService } from "../src/user/user.service"
import { ConfirmSignUpBody } from "../../_common/auth/ConfirmSignUpBody"
import assert from "node:assert"
import { SESSION_COOKIE } from "../src/auth/auth.constants"
import * as cookie from "cookie"

describe("AuthController (e2e)", () => {
  let app: INestApplication<App>
  let userService: UserService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    userService = moduleFixture.get(UserService)
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
      .send({ email: "wrong-email", password: "secret" })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send({ email: "alice@example.com", password: "" })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("/signUp (POST)", async () => {
    const email = "alice@example.com"
    const password = "secret"

    // 0) Cleaning
    await userService.deleteUser(email)

    // 1) SignUp
    const signUpBody: SignUpBody = {
      email: email,
      password: password,
    }
    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send(signUpBody)
      .expect(HttpStatus.OK, "")
    const verificationCode = await userService.fetchVerificationCode(email)
    assert.notStrictEqual(verificationCode, null)

    // 2) Confirm sign-up
    const confirmSignBody: ConfirmSignUpBody = {
      email: email,
      verificationCode: verificationCode!,
    }
    const confirmSignUpResponse = await request(app.getHttpServer())
      .post("/auth/confirmSignUp")
      .send(confirmSignBody)
      .expect(HttpStatus.CREATED)
    const confirmSignUpCookieHeader = confirmSignUpResponse.headers["set-cookie"][0]
    const confirmSignUpCookies = cookie.parse(confirmSignUpCookieHeader)
    assert.ok(SESSION_COOKIE in confirmSignUpCookies)
    assert.ok(confirmSignUpCookies["Path"] === "/")
    assert.ok("Max-Age" in confirmSignUpCookies)
    assert.ok("Expires" in confirmSignUpCookies)
    assert.ok("SameSite" in confirmSignUpCookies)

    // 3) Try to sign-up again
    await request(app.getHttpServer())
      .post("/auth/signUp")
      .send(signUpBody)
      .expect(HttpStatus.CONFLICT)

    // 4) Sign out
    const signOutResponse = await request(app.getHttpServer())
      .post("/auth/signOut")
      .expect(HttpStatus.CREATED)
    const signOutCookieHeader = signOutResponse.headers["set-cookie"][0]
    const signOutCookies = cookie.parse(signOutCookieHeader)
    assert.strictEqual(signOutCookies[SESSION_COOKIE], "")
  })
})
