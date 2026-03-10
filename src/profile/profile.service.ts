// =============================================
// ProfileService
// Consulta de perfil del paciente (solo lectura)
// =============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    // Obtener perfil del paciente por su DPI
    async getProfile(dpi: string) {
        const patient = await this.prisma.patient.findUnique({
            where: { dpi },
        });

        if (!patient) {
            throw new NotFoundException('Paciente no encontrado');
        }

        // Retornar solo datos seguros (sin info sensible del sistema)
        return {
            dpi: patient.dpi,
            firstName: patient.firstName,
            lastName: patient.lastName,
            birthDate: patient.birthDate,
            sex: patient.sex,
            bloodType: patient.bloodType,
            phone: patient.phone,
            address: patient.address,
            emergencyContact: patient.emergencyContact,
            emergencyPhone: patient.emergencyPhone,
        };
    }
}