// =============================================
// DTO para autoregistro de paciente
// El paciente se registra con su DPI y crea credenciales
// El auditor debe aprobar la cuenta despues
// =============================================

import {
    IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches, Length,
} from 'class-validator';

export class RegisterPatientDto {
    @IsNotEmpty({ message: 'El DPI es obligatorio' })
    @IsString({ message: 'El DPI debe ser texto' })
    @Length(13, 13, { message: 'El DPI debe tener exactamente 13 digitos' })
    @Matches(/^\d{13}$/, { message: 'El DPI solo puede contener numeros (13 digitos)' })
    dpi: string;

    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsEmail({}, { message: 'El correo debe tener formato valido' })
    @MaxLength(100, { message: 'El correo no puede exceder 100 caracteres' })
    email: string;

    @IsNotEmpty({ message: 'La contrasena es obligatoria' })
    @IsString({ message: 'La contrasena debe ser texto' })
    @MinLength(8, { message: 'La contrasena debe tener minimo 8 caracteres' })
    @MaxLength(50, { message: 'La contrasena no puede exceder 50 caracteres' })
    @Matches(/[A-Z]/, { message: 'La contrasena debe tener al menos una mayuscula' })
    @Matches(/[0-9]/, { message: 'La contrasena debe tener al menos un numero' })
    password: string;
}