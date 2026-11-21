import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Razorpay from 'razorpay';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Course } from '../course/entities/course.entity';
import { CourseEnrollment } from '../course-enrollment/entities/course-enrollment.entity';
import { PaymentStatus, PaidOrFree } from 'src/enum';
import { InitiatePaymentDto } from './dto/create-payment.dto';
import { InitiatePaymentResponseDto } from './dto/payment-response.dto';
import { IPaymentService } from './interfaces/payment-service.interface';
import * as crypto from 'crypto';
import { VerifyPaymentDto } from './dto/create-payment.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class PaymentService implements IPaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly razorpay: Razorpay;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollmentRepo: Repository<CourseEnrollment>,

    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.getOrThrow('RAZORPAY_KEY_ID'),
      key_secret: this.configService.getOrThrow('RAZORPAY_KEY_SECRET'),
    });
  }

  async initiatePayment(
    accountId: string,
    dto: InitiatePaymentDto,
  ): Promise<InitiatePaymentResponseDto> {
    const course = await this.courseRepo.findOne({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.access_type !== PaidOrFree.PAID) {
      throw new BadRequestException('This course does not require payment');
    }

    const fullPrice = Number(course.price);

    if (!fullPrice || fullPrice <= 0) {
      throw new BadRequestException('Invalid course price');
    }

    const existingEnrollment = await this.courseEnrollmentRepo.findOne({
      where: {
        account: { id: accountId },
        course: { id: dto.courseId },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    const amount = Math.round(fullPrice * 100);

    let order: any;

    try {
      order = await this.razorpay.orders.create({
        amount,
        currency: this.configService.get('RAZORPAY_CURRENCY', 'INR'),
        receipt: `rcpt_${Date.now()}`,
      });
    } catch (err) {
      this.logger.error('Razorpay order creation failed', err?.error ?? err);

      throw new BadRequestException(
        err?.error?.description ?? 'Failed to create payment order',
      );
    }

    const transactionId = await this.generateTransactionId();

    const payment = await this.paymentRepo.save(
      this.paymentRepo.create({
        accountId,
        courseId: dto.courseId,
        amount: fullPrice,
        paymentStatus: PaymentStatus.PENDING,
        razorpayOrderId: order.id,
        transactionId,
      }),
    );

    return {
      razorpayOrderId: order.id,
      amount,
      currency: order.currency,
      keyId: this.configService.getOrThrow('RAZORPAY_KEY_ID'),
      transactionId: payment.transactionId,
    };
  }

  async verifyPayment(
    accountId: string,
    dto: VerifyPaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { razorpayOrderId: dto.razorpayOrderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.accountId !== accountId) {
      throw new NotFoundException('Payment not found');
    }

    // Verify signature
    const body = dto.razorpayOrderId + '|' + dto.razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        this.configService.getOrThrow('RAZORPAY_KEY_SECRET'),
      )
      .update(body)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      payment.paymentStatus = PaymentStatus.FAILED;
      await this.paymentRepo.save(payment);

      throw new BadRequestException(
        'Payment verification failed - invalid signature',
      );
    }

    payment.razorpayPaymentId = dto.razorpayPaymentId;
    payment.razorpaySignature = dto.razorpaySignature;
    payment.paymentStatus = PaymentStatus.SUCCESS;

    const saved = await this.paymentRepo.save(payment);

    // Create course enrollment
    const existingEnrollment = await this.courseEnrollmentRepo.findOne({
      where: {
        account: { id: accountId },
        course: { id: payment.courseId },
      },
    });

    if (!existingEnrollment) {
      await this.courseEnrollmentRepo.save(
        this.courseEnrollmentRepo.create({
          account: { id: accountId },
          course: { id: payment.courseId },
          status: DefaultStatus.ACTIVE,
        }),
      );
    }

    return saved;
  }

  private async generateTransactionId(): Promise<string> {
    const today = new Date();

    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    const prefix = `TXN${year}${month}${day}`;

    // Get the latest transaction ID for today
    const latestPayment = await this.paymentRepo
      .createQueryBuilder('payment')
      .where('payment.transactionId LIKE :prefix', {
        prefix: `${prefix}%`,
      })
      .orderBy('payment.transactionId', 'DESC')
      .getOne();

    let sequence = 1;

    if (latestPayment?.transactionId) {
      const lastSequence = parseInt(latestPayment.transactionId.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  async myPurchases(accountId: string): Promise<Payment[]> {
    const payments = await this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.course', 'course')
      .where('payment.accountId = :accountId', { accountId })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();

    return payments;
  }
}
