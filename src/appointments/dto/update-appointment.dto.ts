import { IsString, IsDateString, IsOptional, Matches } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional() @IsString()
  patientId?: string;

  @IsOptional() @IsString()
  professionalId?: string;

  @IsOptional() @IsDateString()
  date?: string;

  @IsOptional() @Matches(/^\d{2}:\d{2}$/)
  time?: string;

  @IsOptional() @IsString()
  reason?: string;
}
