import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class InitiatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string;

  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @IsNotEmpty()
  @IsString()
  razorpaySignature: string;
}