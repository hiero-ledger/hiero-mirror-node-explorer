// SPDX-License-Identifier: Apache-2.0

import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Req,
  UnauthorizedException,
} from "@nestjs/common"
import { EntityLabelService } from "./entity-label.service"
import { EntityLabel } from "./dto/EntityLabel"
import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"
import { NewEntityLabelDTO } from "./dto/EntityLabelDTO"

@Controller("label/:network")
export class EntityLabelController {
  constructor(private readonly entityLabelService: EntityLabelService) {}

  @Get()
  async list(
    @Req() request: Request,
    @Param("network") network: string,
  ): Promise<EntityLabel[]> {
    let result: EntityLabel[]

    const jwt: JwtPayload | undefined = request["jwt"]
    if (jwt) {
      if (jwt.sub) {
        result = await this.entityLabelService.select(jwt.sub, network)
      } else {
        throw new InternalServerErrorException("sub is missing in jwt")
      }
    } else {
      throw new UnauthorizedException()
    }

    return Promise.resolve(result)
  }

  @Put("/:entityId")
  async write(
    @Req() request: Request,
    @Param("network") network: string,
    @Param("entityId") entityId: string,
    @Body() newEntityLabel: NewEntityLabelDTO,
  ): Promise<EntityLabel> {
    let result: EntityLabel

    const jwt: JwtPayload | undefined = request["jwt"]
    if (jwt) {
      if (jwt.sub) {
        result = await this.entityLabelService.insertOrUpdate(
          jwt.sub,
          network,
          entityId,
          newEntityLabel,
        )
      } else {
        throw new InternalServerErrorException("sub is missing in jwt")
      }
    } else {
      throw new UnauthorizedException()
    }

    return Promise.resolve(result)
  }

  @Delete("/:entityId")
  async clear(
    @Req() request: Request,
    @Param("network") network: string,
    @Param("entityId") entityId: string,
  ): Promise<void> {
    const jwt: JwtPayload | undefined = request["jwt"]
    if (jwt) {
      if (jwt.sub) {
        const deleted = await this.entityLabelService.delete(
          jwt.sub,
          network,
          entityId,
        )
        if (!deleted) {
          throw new NotFoundException()
        }
      } else {
        throw new InternalServerErrorException("sub is missing in jwt")
      }
    } else {
      throw new UnauthorizedException()
    }
  }

  // For testing purpose
  async end() {
    await this.entityLabelService.end()
  }
}
