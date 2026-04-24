import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(filters: FilterAppointmentDto) {
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment');

    if (filters.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: filters.status });
    }

    if (filters.date) {
      queryBuilder.andWhere('appointment.date = :date', { date: filters.date });
    }

    if (filters.patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', { patientId: filters.patientId });
    }

    if (filters.doctorId) {
      queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId: filters.doctorId });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    return appointment;
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointment = this.appointmentRepository.create(createAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);
    
    Object.assign(appointment, updateAppointmentDto);
    
    return await this.appointmentRepository.save(appointment);
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const appointment = await this.findOne(id);
    
    appointment.status = updateStatusDto.status;
    
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);
    
    return await this.appointmentRepository.remove(appointment);
  }
}
