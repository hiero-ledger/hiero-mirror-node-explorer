import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { UserModule } from "../user/user.module"
import { JwtModule } from "@nestjs/jwt"

describe("AuthService", () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, JwtModule],
      providers: [AuthService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it("should be defined", () => {
    assert.notEqual(service, undefined)
  })
})
