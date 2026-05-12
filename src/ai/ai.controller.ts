import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Get('tip')
    async getTip() {
        const tip = await this.aiService.getDailyHealthTip();
        return { tip };
    }
}