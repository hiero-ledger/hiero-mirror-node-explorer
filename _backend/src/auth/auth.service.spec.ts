import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { afterEach, beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { UserModule } from "../user/user.module"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule } from "@nestjs/config"

describe("AuthService", () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, JwtModule, ConfigModule],
      providers: [AuthService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  afterEach(async () => {
    await service.end()
  })

  it("should be defined", () => {
    assert.notEqual(service, undefined)
  })
})
