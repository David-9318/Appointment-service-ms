import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export class FilterAppointmentDto {
  @IsOptional() @IsString()
  patientId?: string;

  @IsOptional() @IsString()
  professionalId?: string;

  @IsOptional() @IsDateString()
  date?: string;

  @IsOptional() @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
