// noinspection DuplicatedCode
// SPDX-License-Identifier: Apache-2.0

import { afterEach, beforeEach, describe, it } from "node:test"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { UserService } from "../src/user/user.service"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../src/app/app.module"
import { ConfigModule } from "@nestjs/config"
import { mainConfig } from "../src/main.config"
import { AppController } from "../src/app/app.controller"
import request from "supertest"
import assert from "node:assert"
import { ConfirmSignUpBody } from "../../_common/auth/ConfirmSignUpBody"
import { EntityType } from "../src/4frontend/EntityLabel"
import { NewEntityLabelDTO } from "../src/entity-label/dto/EntityLabelDTO"

describe("EntityLabelController (e2e)", () => {
  let app: INestApplication<App>
  const email = "alice@example.com"
  const password = "secret"
  let userId: string
  let cookieHeaders: string

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

    const userService = moduleFixture.get(UserService)
    await userService.deleteUser(email)

    // Creates and verifies test user
    const verificationCode = await userService.createUnverifiedUser(
      email,
      password,
    )
    assert.notEqual(verificationCode, null)
    const confirmSignBody: ConfirmSignUpBody = {
      email: email,
      verificationCode: verificationCode!,
    }
    const confirmSignUpResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/confirmSignUp")
      .send(confirmSignBody)
      .expect(HttpStatus.CREATED)
    cookieHeaders = confirmSignUpResponse.headers["set-cookie"][0]
    const user = confirmSignUpResponse.body
    assert.notEqual(user, null)
    userId = user!.userId
  })

  afterEach(async () => {
    const controller = app.get<AppController>(AppController)
    await controller.end()
  })

  it("add + remove", async () => {
    // 1) lists existing labels => empty result
    const listResponse = await request(app.getHttpServer())
      .get("/api/v1/label/mainnet")
      .set("Cookie", [cookieHeaders])
      .expect(HttpStatus.OK)
    assert.deepStrictEqual(listResponse.body, [])

    // 2) adds new label
    const entityId = "0.0.4242"
    const newEntityLabel: NewEntityLabelDTO = {
      name: "Nice Label",
      description: "This is a very nice label",
      entityType: EntityType.Contract,
      labelType: "Mysterious contract",
      networkGenesis: "1568411631.396440001",
      publicKeyDer:
        "0x302d300706052b8104000a0322000265a86db3c08cb2bef6c54fca57169b98d47ea7b226843738a60b7e175b4ac52e",
      website: "https://example.com",
    }
    const addResponse = await request(app.getHttpServer())
      .put("/api/v1/label/mainnet/" + entityId)
      .set("Cookie", [cookieHeaders])
      .send(newEntityLabel)
      .expect(HttpStatus.OK)
    const entityLabel = addResponse.body
    assert.equal(entityLabel.entityId, entityId)
    assert.ok(entityLabel.createdAt.length > 0)
    assert.equal(entityLabel.updatedAt, null)

    const expectedEntityLabel = {
      entityId: entityLabel.entityId,
      createdAt: entityLabel.createdAt,
      updatedAt: entityLabel.updatedAt,
      ...newEntityLabel,
    }
    assert.deepStrictEqual(entityLabel, expectedEntityLabel)

    // 3) lists existing labels again => 1 result item
    const listResponseAgain = await request(app.getHttpServer())
      .get("/api/v1/label/mainnet")
      .set("Cookie", [cookieHeaders])
      .expect(HttpStatus.OK)
    assert.deepStrictEqual(listResponseAgain.body, [expectedEntityLabel])

    // 4) removes label
    await request(app.getHttpServer())
      .delete("/api/v1/label/mainnet/" + entityId)
      .set("Cookie", [cookieHeaders])
      .expect(HttpStatus.OK)

    // 5) lists existing labels last time => empty result
    const listResponseLast = await request(app.getHttpServer())
      .get("/api/v1/label/mainnet")
      .set("Cookie", [cookieHeaders])
      .expect(HttpStatus.OK)
    assert.deepStrictEqual(listResponseLast.body, [])

    // 6) tries to remove label again
    await request(app.getHttpServer())
      .delete("/api/v1/label/mainnet/" + entityId)
      .set("Cookie", [cookieHeaders])
      .expect(HttpStatus.NOT_FOUND)
  })
})
