// SPDX-License-Identifier: Apache-2.0

import { INestApplication, ValidationPipe } from "@nestjs/common"
import cookieParser from "cookie-parser"

export function mainConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
}
