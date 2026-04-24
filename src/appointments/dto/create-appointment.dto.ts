import { IsString, IsDateString, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  professionalId: string;

  @IsDateString()
  date: string;

  @Matches(/^\d{2}:\d{2}$/)
  time: string;

  @IsString()
  reason: string;
}
