import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception-filter';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-interseptor';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });
    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: '*',
    });
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
