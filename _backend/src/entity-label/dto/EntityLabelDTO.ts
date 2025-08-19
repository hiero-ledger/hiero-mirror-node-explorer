// SPDX-License-Identifier: Apache-2.0

import { Length } from "class-validator"
import { EntityType, NewEntityLabel } from "./EntityLabel"

export class NewEntityLabelDTO implements NewEntityLabel {
  @Length(0, 35)
  name: string = ""

  @Length(0, 35)
  labelType: string | null = null

  @Length(0, 2000)
  website: string | null = null

  @Length(0, 5000)
  description: string | null = null

  @Length(5, 30)
  entityType: EntityType = EntityType.Account
  publicKeyDer: string | null = null

  @Length(0, 30)
  networkGenesis: string = ""
}
