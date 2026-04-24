import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async findAll(filters: FilterAppointmentDto): Promise<Appointment[]> {
    const query = this.appointmentsRepository
      .createQueryBuilder('appointment');

    if (filters.patientId)
      query.andWhere('appointment.patientId = :patientId',
        { patientId: filters.patientId });

    if (filters.professionalId)
      query.andWhere('appointment.professionalId = :professionalId',
        { professionalId: filters.professionalId });

    if (filters.date)
      query.andWhere('appointment.date = :date',
        { date: filters.date });

    if (filters.status)
      query.andWhere('appointment.status = :status',
        { status: filters.status });

    return query.getMany();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository
      .findOneBy({ id });
    if (!appointment)
      throw new NotFoundException(`Appointment ${id} not found`);
    return appointment;
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentsRepository.create(dto);
    return this.appointmentsRepository.save(appointment);
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    await this.findOne(id);
    await this.appointmentsRepository.update(id, dto);
    return this.findOne(id);
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Appointment> {
    await this.findOne(id);
    await this.appointmentsRepository.update(id, { status: dto.status });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.appointmentsRepository.delete(id);
  }
}
