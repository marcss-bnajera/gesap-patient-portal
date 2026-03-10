// =============================================
// ProfileController
// GET /gesap-portal/v1/profile - Ver perfil (solo lectura)
// =============================================

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Get()
    getProfile(@CurrentUser('dpi') dpi: string) {
        return this.profileService.getProfile(dpi);
    }
}