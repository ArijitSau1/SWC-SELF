import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Course } from '../course/entities/course.entity';
import { CourseEnrollment } from '../course-enrollment/entities/course-enrollment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Payment, Course, CourseEnrollment]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    { provide: 'IPaymentService', useClass: PaymentService },
  ],
  exports: ['IPaymentService'],
})
export class PaymentModule {}
