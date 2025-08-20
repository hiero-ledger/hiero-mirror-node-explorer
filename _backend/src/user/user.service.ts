// SPDX-License-Identifier: Apache-2.0

import { Inject, Injectable } from "@nestjs/common"
import { PG_POOL } from "../pg/pg.constants"
import pg from "pg"
import argon2 from "argon2"
import { generateVerificationCode } from "../utils"
import { User, UserRole } from "./dto/User"

@Injectable()
export class UserService {
  constructor(@Inject(PG_POOL) private readonly pgPool: pg.Pool) {}

  async createUnverifiedUser(
    email: string,
    password: string,
  ): Promise<string | null> {
    let result: string | null
    const passwordHash = await argon2.hash(password)
    const verificationCode = await generateVerificationCode()
    const r = await this.pgPool.query<string[]>({
      name: "user-create-unverified",
      text: `
        INSERT INTO "user" (email, password_hash, verification_code)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
          DO UPDATE
          SET password_hash     = $2,
              verification_code = $3
        WHERE "user".email = $1
          AND "user".email_verified_at IS NULL
        RETURNING verification_code
      `,
      values: [email, passwordHash, verificationCode],
      rowMode: "array",
    })
    if (r.rowCount == 1 && r.rows.length == 1 && r.rows[0].length == 1) {
      result = r.rows[0][0]
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  async verifyUser(
    email: string,
    verificationCode: string,
  ): Promise<User | null> {
    const r = await this.pgPool.query<string[]>({
      name: "user-verify",
      text: `
        UPDATE "user"
        SET email_verified_at = now()
        WHERE email = $1
          AND email_verified_at IS NULL
          AND verification_code = $2
        RETURNING user_id, first_name, last_name, "role"
      `,
      values: [email, verificationCode],
      rowMode: "array",
    })
    let result: User | null
    if (r.rowCount == 1 && r.rows.length == 1 && r.rows[0].length == 4) {
      const row0 = r.rows[0]
      const userId = row0[0]
      const firstName = row0[1]
      const lastName = row0[2]
      const role = userRoleFromSqlValue(row0[3])
      result = { userId, email, firstName, lastName, role }
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  async deleteUser(email: string): Promise<boolean> {
    const r = await this.pgPool.query({
      name: "user-delete",
      text: `
        DELETE
        FROM "user"
        WHERE email = $1
      `,
      values: [email],
      rowMode: "array",
    })
    return Promise.resolve(r.rowCount == 1)
  }

  async checkUserPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const r = await this.pgPool.query<string[]>({
      name: "user-check-password",
      text: `
        SELECT user_id, password_hash, first_name, last_name, "role"
        FROM "user"
        WHERE email = $1
          AND email_verified_at IS NOT NULL
      `,
      values: [email],
      rowMode: "array",
    })

    let result: User | null
    if (r.rows.length == 1 && r.rows[0].length == 5) {
      const row0 = r.rows[0]
      const userId = row0[0]
      const passwordHash = row0[1]
      const firstName = row0[2]
      const lastName = row0[3]
      const role = userRoleFromSqlValue(row0[4])
      const ok = await argon2.verify(passwordHash, password)
      if (ok) {
        result = { userId, email, firstName, lastName, role }
      } else {
        result = null
      }
    } else {
      result = null
    }

    return Promise.resolve(result)
  }

  async fetchUser(userId: string): Promise<User | null> {
    const r = await this.pgPool.query<string[]>({
      name: "user-fetch",
      text: `
        SELECT email, first_name, last_name, "role"
        FROM "user"
        WHERE user_id = $1
      `,
      values: [userId],
      rowMode: "array",
    })
    let result: User | null
    if (r.rows.length == 1 && r.rows[0].length == 4) {
      const row0 = r.rows[0]
      const email = row0[0]
      const firstName = row0[1]
      const lastName = row0[2]
      const role = userRoleFromSqlValue(row0[3])
      result = { userId, email, firstName, lastName, role }
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  // For testing purpose
  async fetchVerificationCode(email: string): Promise<string | null> {
    const r = await this.pgPool.query<string[]>({
      name: "user-verification-code-fetch",
      text: `
        SELECT verification_code
        FROM "user"
        WHERE email = $1
      `,
      values: [email],
      rowMode: "array",
    })
    let result: string | null
    if (r.rows.length == 1 && r.rows[0].length == 1) {
      result = r.rows[0][0]
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  // For testing purpose
  async end() {
    await this.pgPool.end()
  }
}

// function userRoleToSqlValue(userRole: UserRole): string {
//   let result: string
//   switch (userRole) {
//     default:
//     case UserRole.Developer:
//       result = "developer"
//       break
//     case UserRole.Partner:
//       result = "partner"
//       break
//     case UserRole.CouncilMember:
//       result = "council_member"
//       break
//   }
//   return result
// }

function userRoleFromSqlValue(value: string | null): UserRole | undefined {
  let result: UserRole | undefined
  switch (value) {
    case null:
      result = undefined
      break
    case "developer":
      result = UserRole.Developer
      break
    case "partner":
      result = UserRole.Partner
      break
    case "council_member":
      result = UserRole.CouncilMember
      break
    default:
      throw new Error(
        "Value " + value + " cannot be converted to UserRole enum",
      )
  }
  return result
}
