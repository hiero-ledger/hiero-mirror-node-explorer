// SPDX-License-Identifier: Apache-2.0

import { IsAlphanumeric, IsEmail, Length } from "class-validator"
import { ConfirmSignUpBody } from "../../../../_common/auth/ConfirmSignUpBody"

export class ConfirmSignUpBodyDTO implements ConfirmSignUpBody {
  @IsEmail()
  email: string = ""

  @IsAlphanumeric()
  @Length(8, 8)
  verificationCode: string = ""
}
