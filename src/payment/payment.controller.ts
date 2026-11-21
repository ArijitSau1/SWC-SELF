import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';

import { PaymentService } from './payment.service';
import {
  InitiatePaymentDto,
  VerifyPaymentDto,
} from './dto/create-payment.dto';
import { InitiatePaymentResponseDto } from './dto/payment-response.dto';
import { Payment } from './entities/payment.entity';
import { Account } from 'src/account/entities/account.entity';
import { IPaymentService } from './interfaces/payment-service.interface';

@Controller('payment')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PaymentController {
constructor(
  @Inject('IPaymentService')
  private readonly paymentService: IPaymentService,
) {}

  
  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.USER)
  initiatePayment(
    @Body() dto: InitiatePaymentDto,
    @CurrentUser() user: Account,
  ): Promise<InitiatePaymentResponseDto> {
    return this.paymentService.initiatePayment(user.id, dto);
  }

 
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.USER)
  verifyPayment(
    @Body() dto: VerifyPaymentDto,
    @CurrentUser() user: Account,
  ): Promise<Payment> {
    return this.paymentService.verifyPayment(user.id, dto);
  }

  
  @Get('my')
  @Roles(UserRole.USER)
  myPurchases(
    @CurrentUser() user: Account,
  ): Promise<Payment[]> {
    return this.paymentService.myPurchases(user.id);
  }
}
