import { constants } from 'node:zlib';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
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

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';

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
    .addTag('Posts', 'All the routes related to the posts.')
    .addTag('Static', 'All the routes related to the static files.')
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

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    if (request.url === '/favicon.ico') {
      response.status(404).send(); // backend has no favicon to return
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      this.logger.error(exception.message, exception.stack);

      response.status(status).send({
        statusCode: status,
        message: exception.message,
      });

      return;
    }

    this.logger.error(
      `Unhandled exception on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ZodValidationPipe());

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.register(fastifyCompress, {
    brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 1 } },
  });

  await app.register(multipart);

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

  const configService = app.get(ConfigService);

  const STATIC_ORIGIN = configService.getOrThrow<string>('STATIC_ORIGIN');
  const S3_ENDPOINT = configService.getOrThrow<string>('S3_ENDPOINT');
  const DATABASE_URL = configService.getOrThrow<string>('DATABASE_URL');

  console.log(`Static Origin : ${STATIC_ORIGIN}`);
  console.log(`S3 Endpoint   : ${S3_ENDPOINT}`);
  console.log(`Database URL  : ${DATABASE_URL}`);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap().catch(console.error);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
