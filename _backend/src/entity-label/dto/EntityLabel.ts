// SPDX-License-Identifier: Apache-2.0

export const enum EntityType {
  Account = "account",
  Contract = "contract",
  Token = "token",
  Topic = "topic",
  Schedule = "schedule",
}

export interface NewEntityLabel {
  name: string
  labelType: string | null
  website: string | null
  description: string | null

  entityType: EntityType
  publicKeyDer: string | null

  networkGenesis: string
}

export interface EntityLabel extends NewEntityLabel {
  entityId: string
  createdAt: string
  updatedAt: string | null
}
