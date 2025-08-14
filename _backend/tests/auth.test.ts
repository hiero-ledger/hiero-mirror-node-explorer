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
import { mainConfig } from "../src/main.config"

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
    mainConfig(app)
    await app.init()

    userService = moduleFixture.get(UserService)
  })

  afterEach(async () => {
    const controller = app.get<AppController>(AppController)
    await controller.end()
  })

  it("api/v1/auth/signUp (POST) - bad request", async () => {
    await request(app.getHttpServer())
      .post("/api/v1/auth/signUp")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/signUp")
      .send({})
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/signUp")
      .send("dummy request body")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/signUp")
      .send({ email: "wrong-email", password: "secret" })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/signUp")
      .send({ email: "alice@example.com", password: "" })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("api/v1/auth/confirmSignUp (POST) - bad request", async () => {
    await request(app.getHttpServer())
      .post("/api/v1/auth/confirmSignUp")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/confirmSignUp")
      .send({})
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/confirmSignUp")
      .send("dummy request body")
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/confirmSignUp")
      .send({ email: "wrong-email", verificationCode: "01234567" })
      .expect(HttpStatus.BAD_REQUEST)

    const email = "alice@example.com"
    await userService.deleteUser(email)

    await request(app.getHttpServer())
      .post("/api/v1/auth/confirmSignUp")
      .send({ email: email, verificationCode: "0123456701234567" })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post("/api/v1/auth/confirmSignUp")
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
      .post("/api/v1/auth/signUp")
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
      .post("/api/v1/auth/confirmSignUp")
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
      .post("/api/v1/auth/signUp")
      .send(signUpBody)
      .expect(HttpStatus.CONFLICT)

    // 4) Sign out
    const signOutResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/signOut")
      .set("Cookie", [confirmSignUpCookieHeader])
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
      .post("/api/v1/auth/signIn")
      .send(signInBody)
      .expect(HttpStatus.CREATED)
    const signInCookieHeader = signInResponse.headers["set-cookie"][0]
    const signInCookies = cookie.parse(signInCookieHeader)
    assert.ok(SESSION_COOKIE in signInCookies)
    assert.ok(confirmSignUpCookies["Path"] === "/")
    assert.ok("Max-Age" in signInCookies)
    assert.ok("Expires" in signInCookies)
    assert.ok("SameSite" in signInCookies)
    assert.strictEqual(typeof signInResponse.body.userId, "string")
    assert.strictEqual(signInResponse.body.email, email)

    // 6) fetch current user
    const currentUserResponse = await request(app.getHttpServer())
      .get("/api/v1/user/current")
      .set("Cookie", [signInCookieHeader])
      .expect(HttpStatus.OK)
    assert.notStrictEqual(currentUserResponse.body.userId, undefined)
    assert.strictEqual(currentUserResponse.body.email, email)

    // 7) Sign out
    const signOutResponse2 = await request(app.getHttpServer())
      .post("/api/v1/auth/signOut")
      .set("Cookie", [signInCookieHeader])
      .expect(HttpStatus.CREATED)
    const signOutCookieHeader2 = signOutResponse2.headers["set-cookie"][0]
    const signOutCookies2 = cookie.parse(signOutCookieHeader2)
    assert.strictEqual(signOutCookies2[SESSION_COOKIE], "")

    // 8) Try to fetch current user again => unauthorized
    await request(app.getHttpServer())
      .get("/api/v1/user/current")
      // .set("Cookie", [signInCookieHeader])
      .expect(HttpStatus.UNAUTHORIZED)
  })
})
