// SPDX-License-Identifier: Apache-2.0

import { SignUpBody } from "./SignUpBody"
import { IsEmail, IsNotEmpty } from "class-validator"

export class SignUpBodyDTO implements SignUpBody {
  @IsEmail()
  email: string = ""

  @IsNotEmpty()
  password: string = ""
}
