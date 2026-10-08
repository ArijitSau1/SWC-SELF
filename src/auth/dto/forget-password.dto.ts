import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';


export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(30)
  email: string;
}