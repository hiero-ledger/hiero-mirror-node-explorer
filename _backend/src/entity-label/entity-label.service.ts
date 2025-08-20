// SPDX-License-Identifier: Apache-2.0

import { Inject, Injectable } from "@nestjs/common"
import { EntityLabel, EntityType, NewEntityLabel } from "../4frontend/EntityLabel"
import { AccountId } from "@hashgraph/sdk"
import { PG_POOL } from "../pg/pg.constants"
import pg from "pg"

@Injectable()
export class EntityLabelService {
  constructor(@Inject(PG_POOL) private readonly pgPool: pg.Pool) {}

  async select(userId: string, network: string): Promise<EntityLabel[]> {
    const res = await this.pgPool.query<Record<string, unknown>>({
      name: "entity-label-get",
      text: `
        SELECT shard,
               realm,
               num,
               name,
               label_type,
               description,
               website,
               network_genesis,
               entity_type,
               encode(public_key_der, 'hex') AS key_public_hex,
               created_at::text,
               updated_at::text

        FROM entity_label
        WHERE user_id = $1 AND network_name = $2
        ORDER BY shard, realm, num
      `,
      values: [userId, network],
    })

    return res.rows.map((row) => makeEntityLabel(row))
  }

  async insertOrUpdate(
    userId: string,
    network: string,
    entityId: string,
    newEntityLabel: NewEntityLabel,
  ): Promise<EntityLabel> {
    const newEntityId = AccountId.fromString(entityId)
    const res = await this.pgPool.query<Record<string, unknown>>({
      name: "entity-label-insert",
      text: `
        INSERT INTO entity_label (
            user_id,
            shard,
            realm,
            num,
            name,
            label_type,
            description,
            website,
            network_name,
            network_genesis,
            entity_type,
            public_key_der
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, decode($12, 'hex')) 
        ON CONFLICT (user_id, network_name, shard, realm, num)
        DO UPDATE SET
            name = $5,
            label_type = $6,
            description = $7,
            website = $8,
            network_name = $9,
            network_genesis = $10,
            entity_type = $11,
            public_key_der = decode($12, 'hex')
        RETURNING
            shard,
            realm,
            num,
            name,
            label_type,
            description,
            website,
            network_genesis,
            entity_type,
            encode(public_key_der, 'hex') AS key_public_hex,
            created_at::text,
            updated_at::text
      `,
      values: [
        userId,
        newEntityId.shard.toBigInt(),
        newEntityId.realm.toBigInt(),
        newEntityId.num.toBigInt(),
        newEntityLabel.name,
        newEntityLabel.labelType,
        newEntityLabel.description,
        newEntityLabel.website,
        network,
        newEntityLabel.networkGenesis,
        newEntityLabel.entityType.toString(),
        trim0x(newEntityLabel.publicKeyDer),
      ],
    })

    const result = makeEntityLabel(res.rows[0])

    return Promise.resolve(result)
  }

  async delete(
    userId: string,
    network: string,
    entityId: string,
  ): Promise<boolean> {
    const eid = AccountId.fromString(entityId)
    const res = await this.pgPool.query({
      name: "entity-label-delete",
      text: `
        DELETE FROM entity_label
        WHERE user_id = $1 AND network_name = $2 AND shard = $3 AND realm = $4 AND num = $5
      `,
      values: [
        userId,
        network,
        eid.shard.toBigInt(),
        eid.realm.toBigInt(),
        eid.num.toBigInt(),
      ],
    })
    return res.rowCount === 1
  }

  // For testing purpose
  async end() {
    await this.pgPool.end()
  }
}

//
// Utilities
//

function makeEntityLabel(row: Record<string, unknown>): EntityLabel {
  const createdAt = row["created_at"] as string
  const updatedAt = row["updated_at"] as string | null

  const entityId = mapEntityId(row)
  const name = row["name"] as string
  const labelType = row["label_type"] as string | null
  const description = row["description"] as string | null
  const website = row["website"] as string | null
  const networkGenesis = row["network_genesis"] as string
  const entityType = mapEntityType(row)
  const publicKeyHex = row["key_public_hex"] as string | null
  const publicKeyDer = publicKeyHex === null ? null : "0x" + publicKeyHex

  return {
    createdAt,
    updatedAt,
    entityId,
    name,
    labelType,
    website,
    description,
    networkGenesis,
    entityType,
    publicKeyDer,
  }
}

function mapEntityId(row: Record<string, unknown>): string {
  const shard = row["shard"] as bigint
  const realm = row["realm"] as bigint
  const num = row["num"] as bigint
  return `${shard}.${realm}.${num}`
}

function mapEntityType(row: Record<string, unknown>): EntityType {
  let result: EntityType

  const value = row["entity_type"] as string
  switch (value) {
    case "account": {
      result = EntityType.Account
      break
    }
    case "contract": {
      result = EntityType.Contract
      break
    }
    case "token": {
      result = EntityType.Token
      break
    }
    case "topic": {
      result = EntityType.Topic
      break
    }
    default: {
      throw new InconsistentEntityType("Unexpected entity type: " + value)
    }
  }

  return result
}

function trim0x(hex: string | null): string | null {
  return hex !== null && hex.startsWith("0x") ? hex.slice(2) : hex
}

export class InconsistentEntityType extends Error {}
