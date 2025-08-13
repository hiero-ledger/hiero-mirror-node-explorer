// SPDX-License-Identifier: Apache-2.0

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "./auth.decorators"
import { ConfigService } from "@nestjs/config"
import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)
    if (token) {
      const secret =
        this.configService.get<string>("JWT_SECRET_KEY") ?? "secret"
      if (secret) {
        try {
          request["jwt"] = await this.jwtService.verifyAsync<JwtPayload>(
            token,
            { secret },
          )
        } catch {
          throw new UnauthorizedException()
        }
      } else {
        throw Error("JWT_SECRET_KEY is not set")
      }
    } else {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
