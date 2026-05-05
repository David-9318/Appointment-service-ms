import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function todayLocalYyyyMmDd(): string {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Solo para citas nuevas/actualización: la fecha no puede ser anterior a "hoy" (zona horaria del servidor). */
export function IsNotPastCalendarDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotPastCalendarDate',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === undefined || value === null || value === '') {
            return true;
          }
          if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return true;
          }
          return value >= todayLocalYyyyMmDd();
        },
        defaultMessage(args: ValidationArguments) {
          const custom = validationOptions?.message;
          if (typeof custom === 'string') return custom;
          if (typeof custom === 'function') return custom(args);
          return (
            'La fecha no puede ser anterior a hoy ' +
            `(referencia del servidor: ${todayLocalYyyyMmDd()}).`
          );
        },
      },
    });
  };
}
