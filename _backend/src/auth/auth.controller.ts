// SPDX-License-Identifier: Apache-2.0

import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
  ValidationPipe,
} from "@nestjs/common"
import { Public } from "./auth.decorators"
import { AuthService } from "./auth.service"
import { ConfirmSignUpBody } from "../../../_common/auth/ConfirmSignUpBody"
import { ConfirmSignUpResponse } from "../../../_common/auth/ConfirmSignUpResponse"
import { SignUpBodyDTO } from "./dto/SignUpBodyDTO"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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
  ): Promise<ConfirmSignUpResponse> {
    const jwtToken = await this.authService.confirmSignUp(
      confirmSignUpBody.email,
      confirmSignUpBody.verificationCode,
    )
    let result: ConfirmSignUpResponse
    if (jwtToken !== null) {
      result = { accessToken: jwtToken }
    } else {
      throw new UnauthorizedException("Unauthorized")
    }
    return Promise.resolve(result)
  }
}
