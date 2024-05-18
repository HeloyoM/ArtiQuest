import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Roles } from './roles.decorator'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '../secret'
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler());
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret: jwtConstants.secret
            }
        )
        if (!roles) {
            return true;
        }
        const role = payload.role;

        if (roles.includes(role))
            return true

        else return false
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
