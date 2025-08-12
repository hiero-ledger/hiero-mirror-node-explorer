// SPDX-License-Identifier: Apache-2.0

import { Injectable, Logger } from "@nestjs/common"
import { UserService } from "../user/user.service"
import { JwtService } from "@nestjs/jwt"

// https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string

  [key: string]: any
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string): Promise<boolean> {
    const verificationCode = await this.userService.createUnverifiedUser(
      email,
      password,
    )
    if (verificationCode !== null) {
      this.logger.warn(`Verification code for ${email} is: ${verificationCode}`)
    }

    return Promise.resolve(verificationCode !== null)
  }

  async confirmSignUp(
    email: string,
    verificationCode: string,
  ): Promise<string | null> {
    let result: string | null
    const userId = await this.userService.verifyUser(email, verificationCode)
    if (userId !== null) {
      result = await this.makeToken(userId)
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  async signIn(email: string, password: string): Promise<string | null> {
    let result: string | null
    const userId = await this.userService.checkUserPassword(email, password)
    if (userId !== null) {
      result = await this.makeToken(userId)
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  async makeToken(userId: string): Promise<string> {
    const ONE_WEEK = 7 * 60 * 60 * 24
    const now = Date.now() / 1000

    // https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
    const tokenPayload: JwtPayload = {
      sub: userId,
      exp: now + ONE_WEEK,
    }
    return this.jwtService.signAsync(tokenPayload)
  }
}
