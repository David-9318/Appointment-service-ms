import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentsController } from '../src/appointments/appointments.controller';
import { AppointmentsService } from '../src/appointments/appointments.service';
import { Appointment } from '../src/appointments/entities/appointment.entity';
import { AppointmentStatus } from '../src/appointments/enums/appointment-status.enum';
import { PaymentStatus } from '../src/appointments/enums/payment-status.enum';

describe('POST /appointments — validación date & time (e2e)', () => {
  let app: INestApplication;

  const mockRepo = {
    create: jest.fn((dto: object) => ({ ...dto })),
    save: jest.fn((entity: object) =>
      Promise.resolve({
        ...entity,
        id: '11111111-1111-1111-1111-111111111111',
        status: AppointmentStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        createdAt: new Date('2026-05-04T12:00:00.000Z'),
      }),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockRepo,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const validBody = () => ({
    patientId: 'patient-uuid',
    professionalId: 'professional-uuid',
    date: '2026-05-04',
    time: '14:30',
    reason: 'Chequeo general',
  });

  it('201 cuando date es ISO YYYY-MM-DD y time coincide con /^\\d{2}:\\d{2}$/', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send(validBody())
      .expect(201)
      .expect((res) => {
        expect(res.body.date).toBe('2026-05-04');
        expect(res.body.time).toBe('14:30');
      });
  });

  it('400 cuando date no cumple @IsDateString (ej. DD/MM/YYYY)', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send({ ...validBody(), date: '04/05/2026' })
      .expect(400);
  });

  it('400 cuando time incluye segundos (no coincide con HH:mm)', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send({ ...validBody(), time: '14:30:00' })
      .expect(400);
  });

  it('400 cuando time no es HH:mm', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send({ ...validBody(), time: '14h30' })
      .expect(400);
  });
});
