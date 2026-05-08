import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/** Fecha solo-calendario YYYY-MM-DD y existente (no 2026-02-31). */
export function IsCalendarDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCalendarDate',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === undefined || value === null) return false;
          if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
          }
          const [y, m, d] = value.split('-').map(Number);
          const date = new Date(Date.UTC(y, m - 1, d));
          return (
            date.getUTCFullYear() === y &&
            date.getUTCMonth() === m - 1 &&
            date.getUTCDate() === d
          );
        },
        defaultMessage(args: ValidationArguments) {
          const custom = validationOptions?.message;
          if (typeof custom === 'string') return custom;
          if (typeof custom === 'function') return custom(args);
          return 'La fecha debe ser YYYY-MM-DD y una fecha de calendario válida (ej. 2026-08-15).';
        },
      },
    });
  };
}
