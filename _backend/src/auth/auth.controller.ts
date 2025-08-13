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
  ValidationPipe,
} from "@nestjs/common"
import { Response } from "express"
import { Public } from "./auth.decorators"
import { AuthService } from "./auth.service"
import { ConfirmSignUpBody } from "../../../_common/auth/ConfirmSignUpBody"
import { SignUpBodyDTO } from "./dto/SignUpBodyDTO"
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "./auth.constants"
import { JwtService } from "@nestjs/jwt"
import { JwtPayload } from "jsonwebtoken"
import { ConfigService } from "@nestjs/config"
import { CookieOptions } from "express-serve-static-core"

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
  async signUp(@Body(new ValidationPipe()) signUpBody: SignUpBodyDTO) {
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
    @Body() confirmSignUpBody: ConfirmSignUpBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const jwt = await this.authService.confirmSignUp(
      confirmSignUpBody.email,
      confirmSignUpBody.verificationCode,
    )

    if (jwt !== null) {
      this.setupCookie(response, jwt)
    } else {
      throw new UnauthorizedException("Unauthorized")
    }
  }

  // For testing purpose
  async end() {
    await this.authService.end()
  }

  //
  // Private
  //

  private setupCookie(response: Response, jwt: string): void {
    const sparkpostKey = this.configService.get<string>("SPARKPOST_SECRET_KEY")
    const cookieOptions: CookieOptions = {
      maxAge: this.fetchJwtExp(jwt) * 1000,
      sameSite: sparkpostKey ? "strict" : "none",
      // No SPARKPOST_TOKEN means dev mode
      // => sameSite = "none" enables dev Explorer to access dev Explorer Backend
      ...SESSION_COOKIE_OPTIONS,
    }
    response.cookie(SESSION_COOKIE, jwt, cookieOptions)
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
