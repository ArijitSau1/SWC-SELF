import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  password: string;

   @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  confirmPassword: string;


}