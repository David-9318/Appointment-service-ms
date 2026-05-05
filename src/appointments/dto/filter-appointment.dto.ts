import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { IsCalendarDate } from '../../common/validators/is-calendar-date.decorator';

export class FilterAppointmentDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  professionalId?: string;

  /** Filtrar por día guardado (YYYY-MM-DD). Puedes buscar fechas pasadas. */
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsCalendarDate({
    message:
      'El parámetro date del filtro debe ser YYYY-MM-DD y una fecha válida (ej. 2026-03-10).',
  })
  date?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
