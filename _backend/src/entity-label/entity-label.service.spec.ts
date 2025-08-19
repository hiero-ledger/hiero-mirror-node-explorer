// noinspection DuplicatedCode
// SPDX-License-Identifier: Apache-2.0

import { afterEach, beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { Test, TestingModule } from "@nestjs/testing"
import { EntityLabelService } from "./entity-label.service"
import { PgModule } from "../pg/pg.module"
import { UserService } from "../user/user.service"
import { EntityType, NewEntityLabel } from "./dto/EntityLabel"

describe("EntityLabelService", () => {
  let module: TestingModule
  let service: EntityLabelService

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PgModule],
      providers: [EntityLabelService, UserService],
    }).compile()

    service = module.get<EntityLabelService>(EntityLabelService)
  })

  afterEach(async () => {
    await service.end()
  })

  it("should be defined", () => {
    assert.notEqual(service, undefined)
  })

  it("should create + update + delete", async () => {
    // 0) Creates test user
    const email = "alice@exemple.com"
    const password = "secret"
    const userService = module.get<UserService>(UserService)
    await userService.deleteUser(email)
    const verificationCode = await userService.createUnverifiedUser(
      email,
      password,
    )
    assert.notEqual(verificationCode, null)
    const u = await userService.verifyUser(email, verificationCode!)
    assert.notEqual(u, null)
    const userId = u!.userId

    const entityId = "0.0.4242"
    const network = "testnet"

    // 1) Insert entity label
    const newEntityLabel: NewEntityLabel = {
      description: "This is a nice description",
      entityType: EntityType.Account,
      labelType: "Exchange",
      name: "My nice label",
      networkGenesis: "1568411631.396440000",
      publicKeyDer:
        "0x302d300706052b8104000a0322000265a86db3c08cb2bef6c54fca57169b98d47ea7b226843738a60b7e175b4ac52d",
      website: "https://www.example.com",
    }
    const l = await service.insertOrUpdate(
      userId,
      network,
      entityId,
      newEntityLabel,
    )
    assert.equal(l.entityId, entityId)
    assert.ok(l.createdAt.length > 0)
    assert.ok(l.updatedAt === null)

    const expectedEntityLabel = {
      entityId: l.entityId,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      ...newEntityLabel,
    }
    assert.deepStrictEqual(l, expectedEntityLabel)

    // 2) List entity labels => 1 result
    const labels = await service.select(userId, network)
    assert.equal(labels.length, 1)
    assert.deepStrictEqual(labels[0], l)

    // 3) Update entity label
    const newEntityLabelAgain: NewEntityLabel = {
      description: "This is a very nice description",
      entityType: EntityType.Contract,
      labelType: "Committee",
      name: "My very nice label",
      networkGenesis: "1568411631.396440001",
      publicKeyDer:
        "0x302d300706052b8104000a0322000265a86db3c08cb2bef6c54fca57169b98d47ea7b226843738a60b7e175b4ac52e",
      website: "https://example.com",
    }
    const lAgain = await service.insertOrUpdate(
      userId,
      network,
      entityId,
      newEntityLabelAgain,
    )
    assert.equal(lAgain.entityId, entityId)
    assert.ok(lAgain.createdAt.length > 0)
    assert.ok(lAgain.updatedAt !== null && lAgain.updatedAt.length > 0)

    const expectedEntityLabelAgain = {
      entityId: lAgain.entityId,
      createdAt: lAgain.createdAt,
      updatedAt: lAgain.updatedAt,
      ...newEntityLabelAgain,
    }
    assert.deepStrictEqual(lAgain, expectedEntityLabelAgain)

    // 4) List entity labels again => 1 result
    const labelsAgain = await service.select(userId, network)
    assert.equal(labelsAgain.length, 1)
    assert.deepStrictEqual(labelsAgain[0], lAgain)

    // 5) Deletes entity label
    const deleted = await service.delete(userId, network, entityId)
    assert.equal(deleted, true)

    // 6) List entity labels again => 0 result
    const labelsEnd = await service.select(userId, network)
    assert.equal(labelsEnd.length, 0)

    // 7) Tries to delete entity label again
    const deletedAgain = await service.delete(userId, network, entityId)
    assert.equal(deletedAgain, false)
  })
})
