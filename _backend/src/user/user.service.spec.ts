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

    await service.deleteUser(email)

    const verificationCode = await service.createUnverifiedUser(email, password)
    assert.strictEqual(verificationCode?.length, 8)
    const verificationCode2 = await service.createUnverifiedUser(
      email,
      password,
    )
    assert.strictEqual(verificationCode2?.length, 8)
    assert.notEqual(verificationCode, verificationCode2)

    const deleted = await service.deleteUser(email)
    assert.strictEqual(deleted, true)
  })
})
