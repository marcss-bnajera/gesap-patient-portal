// =============================================
// AuthController del Portal
// Registro, login y gestion de aprobaciones
// =============================================

import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // POST /gesap-portal/v1/auth/register (publico)
    @Post('register')
    register(@Body() dto: RegisterPatientDto) {
        return this.authService.register(dto);
    }

    // POST /gesap-portal/v1/auth/login (publico)
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    // GET /gesap-portal/v1/auth/pending (requiere token de auditor via gesap-api)
    @Get('pending')
    findPending() {
        return this.authService.findPending();
    }

    // PATCH /gesap-portal/v1/auth/approve/:id
    @Patch('approve/:id')
    approve(@Param('id', ParseIntPipe) id: number) {
        return this.authService.updateStatus(id, 'APPROVED', 1);
    }

    // PATCH /gesap-portal/v1/auth/reject/:id
    @Patch('reject/:id')
    reject(@Param('id', ParseIntPipe) id: number) {
        return this.authService.updateStatus(id, 'REJECTED', 1);
    }
}