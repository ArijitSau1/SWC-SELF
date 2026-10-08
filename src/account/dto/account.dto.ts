import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { DefaultStatus } from 'src/enum';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

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

export class PaginationDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(50)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1000)
  offset: number;

  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

}