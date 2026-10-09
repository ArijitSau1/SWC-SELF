import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordReset } from './entities/forget-password.entity';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(PasswordReset) private prRepo:Repository<PasswordReset>,
    private readonly nodeMailerService:NodeMailerService
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.getUserDetails(email);
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = await APIFeatures.assignJwtToken(user.id, this.jwtService);

    return { token };
  }

  validate(id: string) {
    return this.getUserDetails(id);
  }

  private readonly getUserDetails = async (id: string): Promise<any> => {
    const query = this.repo.createQueryBuilder('account');

    const result = await query
      .where('account.id = :id OR account.email = :email', {
        id: id,
        email: id,
      })
      .getOne();

    if (!result) {
      throw new UnauthorizedException('Account not found!');
    }

    return result;
  };

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async forgetPass(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const otp = this.generateOtp();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.prRepo.save({email,otp,expiresAt});
    await this.nodeMailerService.sendForgotPasswordOtp(email,otp);

    return{
      message: 'Verification code sent successfully',
    }
  }

  async otpVerify(email:string,otp:string){
    const verifyCode=await this.prRepo.findOne({
      where:{
        email,otp
      }
    });
    if (!verifyCode) {
      throw new UnauthorizedException('Invalid otp');
    }

        if (verifyCode.verified) {
      throw new UnauthorizedException('Verification code already used');
    }

    if (new Date() > verifyCode.expiresAt) {
      throw new UnauthorizedException('otp has expired');
    }

    verifyCode.verified = true;

        await this.prRepo.save(verifyCode);

    return {
      message: 'Verification successful',
    };
  }

  async createNewPass(email:string,newPass:string){
    const resetPassReq = await this.prRepo.findOne({where:{email,verified:true}});

      if (!resetPassReq) {
      throw new UnauthorizedException('Please verify the OTP first');
    }

     const user = await this.repo
      .createQueryBuilder('account')
      .where('account.email = :email', { email })
      .getOne();

        if (!user) {
      throw new UnauthorizedException('Account not found');
    }

    const hashedPassword = await bcrypt.hash(newPass, 13);
    user.password = hashedPassword;
    await this.repo.save(user);

    await this.prRepo.delete(resetPassReq.id);

     return {
      message: 'Password reset successfully',
    };

  }
}
