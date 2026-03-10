// =============================================
// DTOs para Contactos de Emergencia del Portal
// El paciente puede crear, editar y eliminar sus contactos
// Maximo 5 contactos activos por paciente
// =============================================

import {
    IsNotEmpty, IsString, IsOptional, MaxLength, Length, Matches,
} from 'class-validator';

export class CreateEmergencyContactDto {
    @IsNotEmpty({ message: 'El nombre del contacto es obligatorio' })
    @IsString({ message: 'El nombre debe ser texto' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    fullName: string;

    @IsNotEmpty({ message: 'El telefono es obligatorio' })
    @IsString({ message: 'El telefono debe ser texto' })
    @Length(8, 8, { message: 'El telefono debe tener exactamente 8 digitos' })
    @Matches(/^\d{8}$/, { message: 'El telefono solo puede contener numeros (8 digitos)' })
    phone: string;

    @IsOptional()
    @IsString({ message: 'La relacion debe ser texto' })
    @MaxLength(50, { message: 'La relacion no puede exceder 50 caracteres' })
    relationship?: string;
}

export class UpdateEmergencyContactDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fullName?: string;

    @IsOptional()
    @IsString()
    @Length(8, 8, { message: 'El telefono debe tener 8 digitos' })
    @Matches(/^\d{8}$/, { message: 'Solo numeros' })
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    relationship?: string;
}