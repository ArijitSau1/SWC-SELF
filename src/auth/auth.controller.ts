import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreatenewPassDto } from './dto/create-new-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('login')
    signin(@Body()dto:LoginDto){
        return this.authService.signIn(dto.email,dto.password);
    }

      @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgetPass(dto.email);
  }

    @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.otpVerify(dto.email,dto.otp);
  }


    @Post('reset-password')
  async resetPassword(@Body() dto: CreatenewPassDto) {
    return this.authService.createNewPass(dto.email,dto.password);
  }


}
