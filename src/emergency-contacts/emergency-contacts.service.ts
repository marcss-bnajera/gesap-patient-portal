// =============================================
// EmergencyContactsService
// Permite al paciente editar solo sus contactos de emergencia
// =============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto';

@Injectable()
export class EmergencyContactsService {
    constructor(private prisma: PrismaService) { }

    async getEmergencyContact(dpi: string) {
        const patient = await this.prisma.patient.findUnique({ where: { dpi } });

        if (!patient) {
            throw new NotFoundException('Paciente no encontrado');
        }

        return {
            emergencyContact: patient.emergencyContact,
            emergencyPhone: patient.emergencyPhone,
        };
    }

    async updateEmergencyContact(dpi: string, dto: UpdateEmergencyContactDto) {
        const patient = await this.prisma.patient.findUnique({ where: { dpi } });

        if (!patient) {
            throw new NotFoundException('Paciente no encontrado');
        }

        // Solo actualizar los campos de emergencia
        await this.prisma.patient.update({
            where: { dpi },
            data: {
                emergencyContact: dto.emergencyContact ?? patient.emergencyContact,
                emergencyPhone: dto.emergencyPhone ?? patient.emergencyPhone,
            },
        });

        return { message: 'Contacto de emergencia actualizado correctamente' };
    }
}