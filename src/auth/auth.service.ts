// =============================================
// AuthService del Portal
// Autoregistro con DPI + Login + Aprobacion por auditor
// =============================================

import {
    Injectable, UnauthorizedException, ConflictException,
    NotFoundException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // Autoregistro: el paciente crea su cuenta con DPI
    async register(dto: RegisterPatientDto) {
        // Verificar que el DPI exista en la tabla de pacientes
        const patient = await this.prisma.patient.findUnique({
            where: { dpi: dto.dpi },
        });

        if (!patient) {
            throw new NotFoundException(
                'No se encontro un paciente con ese DPI. Debe estar registrado en el sistema primero.',
            );
        }

        // Verificar que no tenga cuenta ya
        const existingAccount = await this.prisma.patientAccount.findUnique({
            where: { dpi: dto.dpi },
        });

        if (existingAccount) {
            throw new ConflictException('Ya existe una cuenta registrada con ese DPI');
        }

        const emailInUse = await this.prisma.patientAccount.findUnique({
            where: { email: dto.email },
        });

        if (emailInUse) {
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

    // Login del paciente
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

    // Listar cuentas pendientes (para el auditor)
    async findPending() {
        return this.prisma.patientAccount.findMany({
            where: { status: 'PENDING' },
            select: { id: true, dpi: true, email: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
    }

    // Aprobar o rechazar cuenta
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