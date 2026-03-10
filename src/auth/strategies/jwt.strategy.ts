// =============================================
// JwtStrategy para el Portal de Pacientes
// =============================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { sub: number; dpi: string }) {
        const account = await this.prisma.patientAccount.findUnique({
            where: { id: payload.sub },
        });

        if (!account || account.status !== 'APPROVED') {
            throw new UnauthorizedException('Cuenta no encontrada o no aprobada');
        }

        return { id: account.id, dpi: account.dpi, email: account.email };
    }
}