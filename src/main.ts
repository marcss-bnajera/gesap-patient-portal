// =============================================
// GESAP Patient Portal - Punto de entrada
// Puerto 3002 - Prefijo: /gesap-portal/v1
// =============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('gesap-portal/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    app.enableCors({ origin: '*', credentials: true });

    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`GESAP Portal ejecutandose en http://localhost:${port}/gesap-portal/v1`);
}

bootstrap();