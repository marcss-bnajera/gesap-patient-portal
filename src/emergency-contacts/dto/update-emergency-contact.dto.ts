// =============================================
// DTO para actualizar contacto de emergencia
// Es lo unico que el paciente puede editar
// =============================================

import { IsOptional, IsString, MaxLength, Length, Matches } from 'class-validator';

export class UpdateEmergencyContactDto {
    @IsOptional()
    @IsString({ message: 'El nombre del contacto debe ser texto' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    emergencyContact?: string;

    @IsOptional()
    @IsString({ message: 'El telefono debe ser texto' })
    @Length(8, 8, { message: 'El telefono debe tener exactamente 8 digitos' })
    @Matches(/^\d{8}$/, { message: 'El telefono solo puede contener numeros (8 digitos)' })
    emergencyPhone?: string;
}