// =============================================
// EmergencyContactsController
// GET y PATCH del contacto de emergencia del paciente
// =============================================

import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { EmergencyContactsService } from './emergency-contacts.service';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('emergency-contacts')
@UseGuards(JwtAuthGuard)
export class EmergencyContactsController {
    constructor(private service: EmergencyContactsService) { }

    @Get()
    get(@CurrentUser('dpi') dpi: string) {
        return this.service.getEmergencyContact(dpi);
    }

    @Patch()
    update(@CurrentUser('dpi') dpi: string, @Body() dto: UpdateEmergencyContactDto) {
        return this.service.updateEmergencyContact(dpi, dto);
    }
}