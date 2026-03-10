// =============================================
// EmergencyContactsService (Portal)
// El paciente puede gestionar sus propios contactos de emergencia
// Maximo 5 contactos activos por paciente
// =============================================

import {
    Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './dto/emergency-contact.dto';

@Injectable()
export class EmergencyContactsService {
    constructor(private prisma: PrismaService) { }

    // Obtener el paciente por DPI (necesario para vincular contactos)
    private async getPatientByDpi(dpi: string) {
        const patient = await this.prisma.patient.findUnique({ where: { dpi } });

        if (!patient) {
            throw new NotFoundException(
                'No se encontro tu perfil de paciente. Puede que aun no te hayan registrado en el sistema.',
            );
        }

        return patient;
    }

    // Listar mis contactos de emergencia
    async findMyContacts(dpi: string) {
        const patient = await this.getPatientByDpi(dpi);

        return this.prisma.emergencyContact.findMany({
            where: { patientId: patient.id, isActive: true },
            orderBy: { createdAt: 'asc' },
        });
    }

    // Crear un contacto de emergencia (max 5)
    async create(dpi: string, dto: CreateEmergencyContactDto) {
        const patient = await this.getPatientByDpi(dpi);

        // Verificar limite de 5 contactos
        const count = await this.prisma.emergencyContact.count({
            where: { patientId: patient.id, isActive: true },
        });

        if (count >= 5) {
            throw new BadRequestException(
                'Ya tienes 5 contactos de emergencia (maximo permitido). Elimina uno para agregar otro.',
            );
        }

        return this.prisma.emergencyContact.create({
            data: {
                patientId: patient.id,
                fullName: dto.fullName,
                phone: dto.phone,
                relationship: dto.relationship,
            },
        });
    }

    // Editar un contacto (solo si es mio)
    async update(dpi: string, contactId: number, dto: UpdateEmergencyContactDto) {
        const patient = await this.getPatientByDpi(dpi);

        const contact = await this.prisma.emergencyContact.findUnique({
            where: { id: contactId },
        });

        if (!contact) {
            throw new NotFoundException('Contacto de emergencia no encontrado');
        }

        // Verificar que el contacto pertenece a este paciente
        if (contact.patientId !== patient.id) {
            throw new ForbiddenException('No puedes editar contactos de otro paciente');
        }

        return this.prisma.emergencyContact.update({
            where: { id: contactId },
            data: dto,
        });
    }

    // Eliminar un contacto (soft delete, solo si es mio)
    async remove(dpi: string, contactId: number) {
        const patient = await this.getPatientByDpi(dpi);

        const contact = await this.prisma.emergencyContact.findUnique({
            where: { id: contactId },
        });

        if (!contact) {
            throw new NotFoundException('Contacto de emergencia no encontrado');
        }
        if (contact.patientId !== patient.id) {
            throw new ForbiddenException('No puedes eliminar contactos de otro paciente');
        }

        return this.prisma.emergencyContact.update({
            where: { id: contactId },
            data: { isActive: false },
        });
    }
}