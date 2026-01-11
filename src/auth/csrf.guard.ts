import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export default class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (!this.validateCsrfToken(request)) {
      throw new UnauthorizedException('Invalid CSRF token, please refresh the page and try again.');
    }

    return true;
  }

  private validateCsrfToken(request: Request): boolean {
    const csrfCookie = request.cookies?.csrf_token;
    const csrfHeader = request.headers['X-CSRF-Token'];

    if (!csrfCookie || !csrfHeader) {
      return false;
    }

    return csrfCookie === csrfHeader;
  }
}
