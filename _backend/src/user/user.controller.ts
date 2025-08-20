// SPDX-License-Identifier: Apache-2.0

import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "../4frontend/User"
import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("current")
  async fetchCurrentUser(@Req() request: Request): Promise<User> {
    let result: User
    const jwt: JwtPayload | undefined = request["jwt"]
    if (jwt) {
      if (jwt.sub) {
        const user = await this.userService.fetchUser(jwt.sub)
        if (user !== null) {
          result = user
        } else {
          throw new InternalServerErrorException(
            "unexpected null value from UserService.fetchUser()",
          )
        }
      } else {
        throw new InternalServerErrorException("sub is missing in jwt")
      }
    } else {
      throw new UnauthorizedException()
    }

    return Promise.resolve(result)
  }

  // For testing purpose
  async end() {
    await this.userService.end()
  }
}
