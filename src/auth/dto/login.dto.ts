// =============================================
// DTO para login de paciente en el portal
// =============================================

import { IsNotEmpty, IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsEmail({}, { message: 'El correo debe tener formato valido' })
    @MaxLength(100, { message: 'El correo no puede exceder 100 caracteres' })
    email: string;

    @IsNotEmpty({ message: 'La contrasena es obligatoria' })
    @IsString({ message: 'La contrasena debe ser texto' })
    password: string;
}