// =============================================
// EmergencyContactsController (Portal)
// CRUD completo de contactos de emergencia del paciente
// GET, POST, PUT, DELETE - todo protegido con JWT
// =============================================

import {
    Controller, Get, Post, Put, Delete,
    Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { EmergencyContactsService } from './emergency-contacts.service';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './dto/emergency-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('emergency-contacts')
@UseGuards(JwtAuthGuard)
export class EmergencyContactsController {
    constructor(private service: EmergencyContactsService) { }

    // GET /gesap-portal/v1/emergency-contacts
    @Get()
    findMyContacts(@CurrentUser('dpi') dpi: string) {
        return this.service.findMyContacts(dpi);
    }

    // POST /gesap-portal/v1/emergency-contacts
    @Post()
    create(@CurrentUser('dpi') dpi: string, @Body() dto: CreateEmergencyContactDto) {
        return this.service.create(dpi, dto);
    }

    // PUT /gesap-portal/v1/emergency-contacts/:id
    @Put(':id')
    update(
        @CurrentUser('dpi') dpi: string,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateEmergencyContactDto,
    ) {
        return this.service.update(dpi, id, dto);
    }

    // DELETE /gesap-portal/v1/emergency-contacts/:id
    @Delete(':id')
    remove(@CurrentUser('dpi') dpi: string, @Param('id', ParseIntPipe) id: number) {
        return this.service.remove(dpi, id);
    }
}