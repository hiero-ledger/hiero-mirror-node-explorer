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

  afterEach(async () => {})

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

    // 2) creates same unverified user again => new verification code is generated
    const verificationCode2 = await service.createUnverifiedUser(
      email,
      password,
    )
    assert.strictEqual(verificationCode2?.length, 8)
    assert.notEqual(verificationCode, verificationCode2)

    // 3) verifies user with wrong verification code
    const verified = await service.verifyUser(email, verificationCode)
    assert.strictEqual(verified, false)

    // 3) verifies user with good verification code
    const verified2 = await service.verifyUser(email, verificationCode2)
    assert.strictEqual(verified2, true)

    // 4) tries to verify again => rejected
    const verified3 = await service.verifyUser(email, verificationCode)
    assert.strictEqual(verified3, false)

    // 5) tries to create unverified user again => rejected
    const verificationCode3 = await service.createUnverifiedUser(email, password)
    assert.strictEqual(verificationCode3, null)

    // 6) deletes user
    const deleted = await service.deleteUser(email)
    assert.strictEqual(deleted, true)
  })
})
