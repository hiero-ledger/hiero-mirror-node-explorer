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
import { SignInBody } from "../../_common/auth/SignInBody"
import { ConfigModule } from "@nestjs/config"

describe("AuthController (e2e)", () => {
  let app: INestApplication<App>
  let userService: UserService

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

  it("/confirmSignUp (POST) - bad request", async () => {
    await request(app.getHttpServer())
      .post("/auth/confirmSignUp")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/confirmSignUp")
      .send({})
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/confirmSignUp")
      .send("dummy request body")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/confirmSignUp")
      .send({ email: "wrong-email", verificationCode: "01234567" })
      .expect(HttpStatus.BAD_REQUEST)

    const email = "alice@example.com"
    await userService.deleteUser(email)

    await request(app.getHttpServer())
      .post("/auth/confirmSignUp")
      .send({ email: email, verificationCode: "0123456701234567" })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/auth/confirmSignUp")
      .send({ email: email, verificationCode: "0123456;" })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("full signing cycle", async () => {
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
    const confirmSignUpCookieHeader =
      confirmSignUpResponse.headers["set-cookie"][0]
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

    // 5) Sign in
    const signInBody: SignInBody = {
      email: email,
      password: password,
    }
    const signInResponse = await request(app.getHttpServer())
      .post("/auth/signIn")
      .send(signInBody)
      .expect(HttpStatus.CREATED)
    const signInCookieHeader = signInResponse.headers["set-cookie"][0]
    const signInCookies = cookie.parse(signInCookieHeader)
    assert.ok(SESSION_COOKIE in signInCookies)
    assert.ok(confirmSignUpCookies["Path"] === "/")
    assert.ok("Max-Age" in signInCookies)
    assert.ok("Expires" in signInCookies)
    assert.ok("SameSite" in signInCookies)

    // 6) Sign out
    const signOutResponse2 = await request(app.getHttpServer())
      .post("/auth/signOut")
      .expect(HttpStatus.CREATED)
    const signOutCookieHeader2 = signOutResponse2.headers["set-cookie"][0]
    const signOutCookies2 = cookie.parse(signOutCookieHeader2)
    assert.strictEqual(signOutCookies2[SESSION_COOKIE], "")
  })
})
