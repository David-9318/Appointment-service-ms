import { IsString, Matches } from 'class-validator';
import { IsCalendarDate } from '../../common/validators/is-calendar-date.decorator';
import { IsNotPastCalendarDate } from '../../common/validators/is-not-past-calendar-date.decorator';

export class CreateAppointmentDto {
  @IsString({ message: 'El identificador del paciente es obligatorio.' })
  patientId: string;

  @IsString({ message: 'El identificador del profesional es obligatorio.' })
  professionalId: string;

  @IsCalendarDate()
  @IsNotPastCalendarDate()
  date: string;

  @Matches(/^\d{2}:\d{2}$/, {
    message:
      'La hora debe estar en formato 24 h HH:mm (dos dígitos), por ejemplo 09:30.',
  })
  time: string;

  @IsString({ message: 'El motivo de la cita es obligatorio.' })
  reason: string;
}
