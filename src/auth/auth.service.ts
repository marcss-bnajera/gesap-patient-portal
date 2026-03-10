import {
    Injectable, UnauthorizedException, ConflictException,
    NotFoundException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterPatientDto) {
        const existingDpi = await this.prisma.patientAccount.findUnique({
            where: { dpi: dto.dpi },
        });
        if (existingDpi) {
            throw new ConflictException('Ya existe una cuenta registrada con ese DPI');
        }

        const existingEmail = await this.prisma.patientAccount.findUnique({
            where: { email: dto.email },
        });
        if (existingEmail) {
            throw new ConflictException('Ese correo ya esta registrado');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const account = await this.prisma.patientAccount.create({
            data: {
                dpi: dto.dpi,
                email: dto.email,
                password: hashedPassword,
            },
        });

        return {
            message: 'Registro exitoso. Tu cuenta esta pendiente de aprobacion por el auditor.',
            accountId: account.id,
            status: account.status,
        };
    }

    async login(dto: LoginDto) {
        const account = await this.prisma.patientAccount.findUnique({
            where: { email: dto.email },
        });

        if (!account) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        if (account.status === 'PENDING') {
            throw new BadRequestException('Tu cuenta aun esta pendiente de aprobacion');
        }

        if (account.status === 'REJECTED') {
            throw new BadRequestException('Tu cuenta fue rechazada. Contacta al administrador.');
        }

        const passwordValid = await bcrypt.compare(dto.password, account.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const payload = { sub: account.id, dpi: account.dpi };

        return {
            message: 'Login exitoso',
            token: this.jwtService.sign(payload),
            account: {
                id: account.id,
                dpi: account.dpi,
                email: account.email,
            },
        };
    }

    async findPending() {
        return this.prisma.patientAccount.findMany({
            where: { status: 'PENDING' },
            select: { id: true, dpi: true, email: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
    }

    async updateStatus(accountId: number, status: 'APPROVED' | 'REJECTED', approvedBy: number) {
        const account = await this.prisma.patientAccount.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            throw new NotFoundException('Cuenta no encontrada');
        }

        return this.prisma.patientAccount.update({
            where: { id: accountId },
            data: {
                status,
                approvedBy,
                approvedAt: status === 'APPROVED' ? new Date() : null,
            },
        });
    }
}
