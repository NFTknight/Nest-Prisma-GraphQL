import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';

@Injectable()
export class GqlGuardIsAdmin implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    readonly configService: ConfigService
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getNext();
    const id = this.jwtService.decode(
      request.req.headers['authorization'].split('Bearer ')[1]
    )?.['userId'];
    return this.prisma.user
      .findUnique({
        where: { id },
      })
      .then((e) => {
        return e.role === Role.ADMIN;
      })
      .catch(() => {
        return false;
      });
  }
}

@Injectable()
export class GqlGuardIsVendor implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    readonly configService: ConfigService
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getNext();
    const id = this.jwtService.decode(
      request.req.headers['authorization'].split('Bearer ')[1]
    )?.['userId'];
    return this.prisma.user
      .findUnique({
        where: { id },
      })
      .then((e) => {
        return e.role === Role.VENDOR;
      })
      .catch(() => {
        return false;
      });
  }
}

@Injectable()
export class GqlGuardIsAgent implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    readonly configService: ConfigService
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getNext();
    const id = this.jwtService.decode(
      request.req.headers['authorization'].split('Bearer ')[1]
    )?.['userId'];
    return this.prisma.user
      .findUnique({
        where: { id },
      })
      .then((e) => {
        return e.role === Role.AGENT;
      })
      .catch(() => {
        return false;
      });
  }
}
