export class InitiatePaymentResponseDto {
  razorpayOrderId: string;

  amount: number;

  currency: string;

  keyId: string;

  transactionId: string;
}