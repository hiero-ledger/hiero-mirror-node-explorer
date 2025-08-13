// SPDX-License-Identifier: Apache-2.0

import { CookieOptions } from "express-serve-static-core"

export const SESSION_COOKIE = "hiero-explorer-session"

export const SESSION_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  secure: true,
  httpOnly: true,
  signed: false,
  sameSite: "strict", // this value may be overridden by AuthController.setupCookie()
}
