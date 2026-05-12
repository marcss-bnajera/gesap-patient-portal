import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private groq: OpenAI;

    constructor() {
        this.groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });
    }

    async getDailyHealthTip() {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Eres un asistente médico experto. Proporciona consejos de salud diferentes cada vez, breves y motivadores para pacientes en Guatemala de maximo 35 caracteres."
                    },
                    {
                        role: "user",
                        content: "Dame un consejo de salud para empezar el día."
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 1,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error con Groq:', error);
            return 'Recuerda beber suficiente agua hoy.';
        }
    }
}