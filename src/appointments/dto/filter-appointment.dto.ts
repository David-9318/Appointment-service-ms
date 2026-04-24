import { IsString, IsDate, IsOptional, IsEnum } from 'class-validator';
import { AppointmentStatus } from './update-status.dto';

export class FilterAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;
}
