import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
    @MinLength(10)
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  password: string;
}