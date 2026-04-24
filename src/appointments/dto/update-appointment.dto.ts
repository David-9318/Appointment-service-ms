import { IsString, IsDate, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends CreateAppointmentDto {
  @IsString()
  @IsOptional()
  status?: string;
}
