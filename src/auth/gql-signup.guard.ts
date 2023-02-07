import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PrismaService } from 'nestjs-prisma';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    readonly configService: ConfigService
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rolesHierarchy = {
      [Role.ADMIN]: [Role.ADMIN],
      [Role.AGENT]: [Role.ADMIN, Role.AGENT],
      [Role.VENDOR]: [Role.ADMIN, Role.AGENT, Role.VENDOR],
    };
    const roleRequired = this.reflector.get<string>(
      'role',
      context.getHandler()
    );
    const request = context.switchToHttp().getNext();
    const id = this.jwtService.decode(
      request.req.headers['authorization']?.split('Bearer ')?.[1] || ''
    )?.['userId'];
    return this.prisma.user
      .findUnique({
        where: { id },
      })
      .then((e) => {
        return rolesHierarchy[roleRequired].includes(e.role);
      })
      .catch(() => {
        return false;
      });
  }
}
