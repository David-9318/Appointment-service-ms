import { IsString, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsCalendarDate } from '../../common/validators/is-calendar-date.decorator';
import { IsNotPastCalendarDate } from '../../common/validators/is-not-past-calendar-date.decorator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  professionalId?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsCalendarDate()
  @IsNotPastCalendarDate()
  date?: string;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/, {
    message:
      'La hora debe estar en formato 24 h HH:mm (dos dígitos), por ejemplo 09:30.',
  })
  time?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
