import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { PaidOrFree } from 'src/enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(PaidOrFree)
  accessType: PaidOrFree;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

}