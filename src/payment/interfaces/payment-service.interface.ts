import {
  InitiatePaymentDto,
  VerifyPaymentDto,
} from '../dto/create-payment.dto';
import { InitiatePaymentResponseDto } from '../dto/payment-response.dto';
import { Payment } from '../entities/payment.entity';

export abstract class IPaymentService {
  abstract initiatePayment(
    accountId: string,
    dto: InitiatePaymentDto,
  ): Promise<InitiatePaymentResponseDto>;

  abstract verifyPayment(
    accountId: string,
    dto: VerifyPaymentDto,
  ): Promise<Payment>;

  abstract myPurchases(accountId: string): Promise<Payment[]>;
}
