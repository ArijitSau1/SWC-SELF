import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;
}