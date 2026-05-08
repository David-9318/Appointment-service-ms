import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function flattenValidationMessages(errors: ValidationError[]): string[] {
  const out: string[] = [];
  for (const e of errors) {
    if (e.constraints) {
      out.push(...Object.values(e.constraints));
    }
    if (e.children?.length) {
      out.push(...flattenValidationMessages(e.children));
    }
  }
  return out;
}

export function getValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const messages = flattenValidationMessages(errors);
      return new BadRequestException({
        statusCode: 400,
        error: 'Solicitud inválida',
        messages,
      });
    },
  });
}
