import { EmergencyContactsController } from './emergency-contacts.controller';

@Module({
    controllers: [EmergencyContactsController],
    providers: [EmergencyContactsService],
})
export class EmergencyContactsModule { }