// SPDX-License-Identifier: Apache-2.0

import { afterEach, beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { PgModule } from "../pg/pg.module"

describe("UserService", () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [PgModule],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  afterEach(async () => {
    await service.end()
  })

  it("should be defined", () => {
    assert.notEqual(service, undefined)
  })

  it("createEmptyUser", async () => {
    const email = "alice@exemple.com"
    const password = "secret"

    // 0) cleaning
    await service.deleteUser(email)

    // 1) creates unverified user
    const verificationCode = await service.createUnverifiedUser(email, password)
    assert.strictEqual(verificationCode?.length, 8)
    assert.strictEqual(await service.checkUserPassword(email, password), null)

    // 2) creates same unverified user again => new verification code is generated
    const verificationCode2 = await service.createUnverifiedUser(
      email,
      password,
    )
    assert.strictEqual(verificationCode2?.length, 8)
    assert.notEqual(verificationCode, verificationCode2)
    assert.strictEqual(await service.checkUserPassword(email, password), null)

    // 3) verifies user with wrong verification code
    const userId = await service.verifyUser(email, verificationCode)
    assert.strictEqual(userId, null)
    assert.strictEqual(await service.checkUserPassword(email, password), null)

    // 3) verifies user with good verification code
    const userId2 = await service.verifyUser(email, verificationCode2)
    assert.notStrictEqual(userId2, null)
    assert.notStrictEqual(
      await service.checkUserPassword(email, password),
      null,
    )

    // 4) tries to verify again => rejected
    const userId3 = await service.verifyUser(email, verificationCode)
    assert.strictEqual(userId3, null)
    assert.notStrictEqual(
      await service.checkUserPassword(email, password),
      null,
    )

    // 5) tries to create unverified user again => rejected
    const verificationCode3 = await service.createUnverifiedUser(
      email,
      password,
    )
    assert.strictEqual(verificationCode3, null)
    assert.notStrictEqual(
      await service.checkUserPassword(email, password),
      null,
    )

    // 6) deletes user
    const deleted = await service.deleteUser(email)
    assert.strictEqual(deleted, true)
    assert.strictEqual(await service.checkUserPassword(email, password), null)
  })
})
