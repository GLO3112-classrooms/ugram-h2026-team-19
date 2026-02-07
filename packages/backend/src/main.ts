import { constants } from 'node:zlib';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import fastifyCompress from '@fastify/compress';

const getSwaggerDocumentConfig = (): Omit<OpenAPIObject, 'paths'> =>
  new DocumentBuilder()
    .setTitle('Ugram API Documentation')
    .setDescription(
      'This document indexes all the available routes, along with their params, queries, payloads and responses.',
    )
    .addTag(
      'Authentication',
      'All the routes related to the authentication process.',
    )
    .addTag('Users', 'All the routes related to the users queries.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        description: "A JWT returned by the 'login' auth endpoint.",
        name: 'bearer',
      },
      'jwt',
    )
    .build();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ZodValidationPipe());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.register(fastifyCompress, {
    brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 1 } },
  });

  const swaggerDocumentationConfig = getSwaggerDocumentConfig();
  const document = SwaggerModule.createDocument(
    app,
    swaggerDocumentationConfig,
  );
  cleanupOpenApiDoc(document);
  const theme = new SwaggerTheme();
  const swaggerConfig: SwaggerCustomOptions = {
    explorer: true,
    customSiteTitle: swaggerDocumentationConfig.info.title,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };
  SwaggerModule.setup('/openapi', app, document, swaggerConfig);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap().catch(console.error);
