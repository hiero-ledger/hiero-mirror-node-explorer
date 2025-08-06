// SPDX-License-Identifier: Apache-2.0

import { beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"

describe("UserService", () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it("should be defined", () => {
    assert.notEqual(service, undefined)
  })
})
