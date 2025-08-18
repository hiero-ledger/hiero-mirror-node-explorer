// SPDX-License-Identifier: Apache-2.0

import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common"
import { Response } from "express"
import { Public } from "./auth.decorators"
import { AuthService } from "./auth.service"
import { ConfirmSignUpBodyDTO } from "./dto/ConfirmSignUpBodyDTO"
import { SignUpBodyDTO } from "./dto/SignUpBodyDTO"
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "./auth.constants"
import { JwtService } from "@nestjs/jwt"
import { JwtPayload } from "jsonwebtoken"
import { ConfigService } from "@nestjs/config"
import { CookieOptions } from "express-serve-static-core"
import { SignInBody } from "./dto/SignInBody"
import { User } from "../user/dto/User"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("signUp")
  async signUp(@Body() signUpBody: SignUpBodyDTO) {
    const accepted = await this.authService.signUp(
      signUpBody.email,
      signUpBody.password,
    )
    if (!accepted) {
      // Someone already sign-up with email
      throw new HttpException("Already signed up", HttpStatus.CONFLICT)
    }
  }

  @Public()
  @Post("confirmSignUp")
  async confirmSignUp(
    @Body() confirmSignUpBody: ConfirmSignUpBodyDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const userAndToken = await this.authService.confirmSignUp(
      confirmSignUpBody.email,
      confirmSignUpBody.verificationCode,
    )

    if (userAndToken !== null) {
      this.setupCookie(response, userAndToken.token)
    } else {
      throw new UnauthorizedException()
    }

    return Promise.resolve(userAndToken.user)
  }

  @Public()
  @Post("signIn")
  async signIn(
    @Body() signInBody: SignInBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const userAndToken = await this.authService.signIn(
      signInBody.email,
      signInBody.password,
    )

    if (userAndToken !== null) {
      this.setupCookie(response, userAndToken.token)
    } else {
      throw new UnauthorizedException()
    }

    return Promise.resolve(userAndToken.user)
  }

  @Post("signOut")
  async signOut(@Res({ passthrough: true }) response: Response): Promise<void> {
    // await this.authService.signOut()
    this.setupCookie(response, null) // Clear cookie
  }

  // For testing purpose
  async end() {
    await this.authService.end()
  }

  //
  // Private
  //

  private setupCookie(response: Response, jwt: string | null): void {
    const cookieOptions = SESSION_COOKIE_OPTIONS

    // No SPARKPOST_TOKEN means dev mode
    // => sameSite = "none" enables dev Explorer to access dev Explorer Backend
    const sparkpostKey = this.configService.get<string>("SPARKPOST_SECRET_KEY")
    cookieOptions.sameSite = sparkpostKey ? "strict" : "none"

    if (jwt !== null) {
      cookieOptions.maxAge = this.fetchJwtExp(jwt) * 1000
      response.cookie(SESSION_COOKIE, jwt, cookieOptions)
    } else {
      // We clear cookie
      response.clearCookie(SESSION_COOKIE, cookieOptions)
    }
  }

  private fetchJwtExp(jwtToken: string): number {
    let result: number
    const jwt = this.jwtService.decode<JwtPayload>(jwtToken)
    if (jwt.exp) {
      result = jwt.exp
    } else {
      throw new InternalServerErrorException("JWT is missing exp field")
    }
    return result
  }
}
