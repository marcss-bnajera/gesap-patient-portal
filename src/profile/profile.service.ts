// =============================================
// ProfileService
// Consulta de perfil del paciente (solo lectura)
// =============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfile(dpi: string) {
        const patient = await this.prisma.patient.findUnique({
            where: { dpi },
            include: {
                emergencyContacts: { where: { isActive: true } },
            },
        });

        if (!patient) {
            throw new NotFoundException(
                'No se encontro tu perfil. Puede que aun no te hayan registrado en el sistema.',
            );
        }

        return {
            dpi: patient.dpi,
            firstName: patient.firstName,
            secondName: patient.secondName,
            thirdName: patient.thirdName,
            firstLastName: patient.firstLastName,
            secondLastName: patient.secondLastName,
            birthDate: patient.birthDate,
            sex: patient.sex,
            bloodType: patient.bloodType,
            phone: patient.phone,
            address: patient.address,
            emergencyContacts: patient.emergencyContacts,
        };
    }
}