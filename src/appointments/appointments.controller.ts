import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    const data = await this.appointmentsService.create(dto);
    return {
      success: true,
      message: 'Cita creada correctamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() filters: FilterAppointmentDto) {
    const data = await this.appointmentsService.findAll(filters);
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.appointmentsService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    const data = await this.appointmentsService.update(id, dto);
    return {
      success: true,
      message: 'Cita actualizada correctamente',
      data,
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    const data = await this.appointmentsService.updateStatus(id, dto);
    return {
      success: true,
      message: 'Estado actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.appointmentsService.remove(id);
    return { success: true, message: 'Cita eliminada correctamente' };
  }
}
