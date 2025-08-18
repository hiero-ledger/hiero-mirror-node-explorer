// SPDX-License-Identifier: Apache-2.0

import { Injectable, Logger } from "@nestjs/common"
import { UserService } from "../user/user.service"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { User } from "../user/dto/User"

export interface UserAndToken {
  user: User
  token: string
}

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
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
  ): Promise<UserAndToken | null> {
    let result: UserAndToken | null
    const user = await this.userService.verifyUser(email, verificationCode)
    if (user !== null) {
      const token = await this.makeToken(user.userId)
      result = { user, token }
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  async signIn(email: string, password: string): Promise<UserAndToken | null> {
    let result: UserAndToken | null
    const user = await this.userService.checkUserPassword(email, password)
    if (user !== null) {
      const token = await this.makeToken(user.userId)
      result = { user, token }
    } else {
      result = null
    }
    return Promise.resolve(result)
  }

  async signOut(email: string): Promise<void> {}

  //
  // Private
  //

  private async makeToken(userId: string): Promise<string> {
    const ONE_WEEK = 7 * 60 * 60 * 24
    const now = Date.now() / 1000

    const secret = this.configService.get<string>("JWT_SECRET_KEY")
    if (!secret) {
      throw Error("JWT_SECRET_KEY is not set")
    }
    const sessionDuration =
      this.configService.get<number>("SESSION_DURATION_SECONDS") ?? ONE_WEEK

    // https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
    const tokenPayload: JwtPayload = {
      sub: userId,
      exp: now + sessionDuration,
    }
    return this.jwtService.signAsync(tokenPayload, { secret })
  }

  // For testing purpose
  async end() {
    await this.userService.end()
  }
}
