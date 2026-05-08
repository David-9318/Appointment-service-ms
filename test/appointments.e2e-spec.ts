import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentsController } from '../src/appointments/appointments.controller';
import { AppointmentsService } from '../src/appointments/appointments.service';
import { Appointment } from '../src/appointments/entities/appointment.entity';
import { AppointmentStatus } from '../src/appointments/enums/appointment-status.enum';
import { PaymentStatus } from '../src/appointments/enums/payment-status.enum';
import { getValidationPipe } from '../src/common/validation/get-validation-pipe';

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
    app.useGlobalPipes(getValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  function tomorrowYyyyMmDd(): string {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const validBody = () => ({
    patientId: 'patient-uuid',
    professionalId: 'professional-uuid',
    date: tomorrowYyyyMmDd(),
    time: '14:30',
    reason: 'Chequeo general',
  });

  it('201 cuando date es YYYY-MM-DD válida (mañana) y time HH:mm', () => {
    const date = tomorrowYyyyMmDd();
    return request(app.getHttpServer())
      .post('/appointments')
      .send(validBody())
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.date).toBe(date);
        expect(res.body.data.time).toBe('14:30');
      });
  });

  it('400 cuando date no es calendario YYYY-MM-DD (ej. DD/MM/YYYY)', () => {
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

  it('400 cuando date es un día inexistente (ej. 2026-02-31)', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send({ ...validBody(), date: '2026-02-31' })
      .expect(400);
  });

  it('400 cuando date es anterior a hoy', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send({ ...validBody(), date: '2000-01-01' })
      .expect(400)
      .expect((res) => {
        expect(res.body.messages?.some((m: string) => m.includes('anterior'))).toBe(
          true,
        );
      });
  });
});
