// =============================================
// Modulo principal del Portal de Pacientes
// =============================================

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { EmergencyContactsModule } from './emergency-contacts/emergency-contacts.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        ProfileModule,
        EmergencyContactsModule,
    ],
})
export class AppModule { }